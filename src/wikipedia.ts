import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

export async function wikipediaSearch(prompt: string) {
  const tool = new WikipediaQueryRun({
    topKResults: 3,
    maxDocContentLength: 4000,
    baseUrl: "https://ja.wikipedia.org/w/api.php",
  });

  const res = await tool.invoke(prompt);

  return res;
}
