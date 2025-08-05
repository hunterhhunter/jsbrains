import { SmartEmbedModel } from "smart-embed-model"
import { SmartEmbedOpenAIAdapter } from 'smart-embed-model/adapters/openai';
import { parse_markdown_blocks } from 'smart-blocks/parsers/markdown';
import * as fs from 'fs/promises'; // Node.js 파일 시스템 모듈

const model = new SmartEmbedModel({
  model_key: 'text-embedding-3-small',
  settings: {
    api_key: ''
  },
  adapters: {
    openai: SmartEmbedOpenAIAdapter
  }
});

const filePath = 'C:/Users/slugg/Documents/GitHub/Obsidian_Storage/20. Project/PKM 에이전트 첨사(尖思)/0. 사업계획서/1. 사업 개요 및 배경.md';
const fileCountent = await fs.readFile(filePath, 'utf-8');

const blocks = parse_markdown_blocks(fileCountent);

console.log(`${Object.keys(blocks).length}개의 블록을 찾았습니다.`);
console.log(`${Object.values(blocks)}`);
const embeddingResults = {};

for (const key in blocks) {
  const [start, end] = blocks[key];
  const blockContent = fileCountent.split('\n').slice(start - 1, end).join('\n');

  if (!blockContent.trim()) continue;

  console.log(`임베딩 중: ${key}`);
  // e. embed() 함수의 반환 타입을 JSDoc으로 명시해줍니다.
  /** @type {{vec: number[], tokens: number}} */
  const result = await model.embed(blockContent);
  embeddingResults[blockContent] = result.vec;
}

// f. 결과를 간단한 JSON 파일로 저장
await fs.writeFile('poc_results.json', JSON.stringify(embeddingResults, null, 2));
console.log("PoC 완료! 결과가 poc_results.json 파일에 저장되었습니다.");