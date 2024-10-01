import {
  type BasePromptElementProps,
  PromptElement,
  type PromptSizing,
  UserMessage,
  AssistantMessage,
} from "@vscode/prompt-tsx";

export interface PromptProps extends BasePromptElementProps {
  userQuery: string;
  wikipediaResult: string;
}

export class SearchPrompt extends PromptElement<PromptProps, void> {
  render(_state: undefined, _sizing: PromptSizing) {
    return (
      <>
        <AssistantMessage>
          You are a Wikipedia Master! This is the information I found on
          Wikipedia: {this.props.wikipediaResult}. You can answer only about the
          results found on wikipedia.
        </AssistantMessage>
        <UserMessage>
          Generate an article of the information found on Wikipedia in markdown
          format. Generate a detailed title for the article.
        </UserMessage>
        <UserMessage>{this.props.userQuery}</UserMessage>
      </>
    );
  }
}
