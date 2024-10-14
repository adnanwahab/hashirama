import { OpenAI } from 'openai';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

const openai_api_key = process.env.OPENAI_KEY;

const client = new OpenAI({
  apiKey: openai_api_key,
});

const json_file_path = join('data', 'odyssey', 'modules.json');
const input_dir = join('data', 'odyssey');
const output_dir = input_dir;

async function appendToFile(chunk, index, outputDir) {
  const outputFilePath = join(outputDir, `parallel_chunk_${index}.txt`);
  await Bun.write(outputFilePath, chunk);
  return chunk;
}

async function emptyFile(outputDir) {
  const startTime = Date.now();
  const outputFilePath = join(outputDir, 'journey-4.css.txt');
  await Bun.write(outputFilePath, '');
  const endTime = Date.now();
  console.log(`Emptying the file took ${endTime - startTime} milliseconds.`);
}

function parseGPT(results) {
  const comp = results;
  if (comp.choices.length === 0) {
    return null;
  }

  const messageContent = comp.choices[0].message.content;
  return messageContent;
}

function splitIntoChunks(css) {
  const cssBlocks = css.split('\n\n');
  const linesPerChunk = 10;
  return cssBlocks.map((_, i) => cssBlocks.slice(i, i + linesPerChunk));
}

const queries = {
  desmos: 'gen a javascript code to visualize topic like desmos ',
  threejs: 'gen a javascript code to visualize topic like threejs ',
  khanacademy: 'gen a javascript code to visualize topic like khanacademy',
  observable: 'gen a javascript code to visualize topic like observable',
  d3js: 'gen a javascript code to visualize topic like d3js',
  research_papers: 'links to any related research papers',
  visualizations: 'links to any visualizaions ',
  videos: 'links to videos',
  tweets: 'links to tweets or any social media ',
  docs: 'docs / websites ',
};

const queryFileExt = {
  demos: 'js',
  threejs: 'js',
  khanacademy: 'js',
  observable: 'js',
  d3js: 'js',
  research_papers: 'md',
  visualizations: 'md',
  videos: 'md',
  tweets: 'md',
  docs: 'md',
  websites: 'md',
};

//  Twitter  LinkedIn  Github  YouTube  Instagram  Email  Terms

async function processChunk(folderName, index) {
  const prompt = Object.values(queries)[index] + `generate a diagram from the folder name ${folderName} `;
  console.log(prompt);
  const chatCompletion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });
  const processed = parseGPT(chatCompletion);
  const outputFilePath = join(input_dir, folderName, `${index}.md`);
  await Bun.write(outputFilePath, processed);
}

async function processAllFilesInDirectory(directoryPath) {
  const folders = readdirSync(directoryPath).filter(
    (folder) => existsSync(join(directoryPath, folder)) &&
      !existsSync(join(directoryPath, folder, 'index.md'))
  );
  const startTime = Date.now();
  for (const folder of folders) {
    for (let index = 0; index < 10; index++) {
      await processChunk(folder, index);
    }
  }
  const endTime = Date.now();
  console.log(`processing all files in directory took ${endTime - startTime} milliseconds`);
}

await processAllFilesInDirectory(input_dir);