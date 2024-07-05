import * as vscode from "vscode";

import { chatHandler } from "./chatHandler";

export function activate(context: vscode.ExtensionContext) {
  const wikipedia = vscode.chat.createChatParticipant(
    "vscode-copilot.wikipedia",
    chatHandler
  );

  wikipedia.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    "wikipedia.png"
  );
}

export function deactivate() {}
