import * as vscode from "vscode";

import { wikipediaSearch } from "./wikipedia";
import { SearchPrompt } from "./prompt";
import { renderPrompt } from "@vscode/prompt-tsx";

export interface IChatResult extends vscode.ChatResult {
  metadata: {
    command: string;
  };
}

const MODEL_SELECTOR: vscode.LanguageModelChatSelector = {
  vendor: "copilot",
  family: "gpt-4o",
};

export const chatHandler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<IChatResult> => {
  stream.progress("Start searching on Wikipedia...");

  try {
    const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);

    if (model) {
      const wikipediaResult = await wikipediaSearch(request.prompt);

      stream.progress("Found some useful informations, starting a summary...");

      const { messages } = await renderPrompt(
        SearchPrompt,
        { userQuery: request.prompt, wikipediaResult },
        { modelMaxPromptTokens: model.maxInputTokens },
        model
      );

      const chatResponse = await model.sendRequest(messages, {}, token);

      for await (const fragment of chatResponse.text) {
        stream.markdown(fragment);
      }
    }
  } catch (err) {
    handleChatError(err, stream);
  }

  return { metadata: { command: "" } };
};

function handleChatError(
  err: unknown,
  stream: vscode.ChatResponseStream
): void {
  // making the chat request might fail because
  // - model does not exist
  // - user consent not given
  // - quote limits exceeded
  if (err instanceof vscode.LanguageModelError) {
    console.error(err.message, err.code, err.cause);
    if (err.cause instanceof Error && err.cause.message.includes("off_topic")) {
      stream.markdown(
        vscode.l10n.t(
          "I'm sorry, I can only answer questions related to the information found on Wikipedia."
        )
      );
    }
  } else {
    // re-throw other errors so they show up in the UI
    throw err;
  }
}
