import {
  type BasePromptElementProps,
  PromptElement,
  type PromptSizing,
  UserMessage,
} from "@vscode/prompt-tsx";

export interface PromptProps extends BasePromptElementProps {
  wikipediaResult: string;
  userQuery: string;
}

export class SearchPrompt extends PromptElement<PromptProps, void> {
  render(_state: undefined, _sizing: PromptSizing) {
    return (
      <>
        <UserMessage>
          You are a Wikipedia Master! This is the information I found on
          Wikipedia: {this.props.wikipediaResult}
        </UserMessage>
        <UserMessage>{this.props.userQuery}</UserMessage>
      </>
    );
  }
}
