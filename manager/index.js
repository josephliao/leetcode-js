const fs = require('fs'),
      process = require('process'),
      path = require('path'),
      promisify = require('util').promisify

const request = require('request')
const cheerio = require('cheerio')

const { selectBy } = require('./store')
const { toLowTitle } = require('./helper')

const readFile = promisify(fs.readFile),
      writeFile = promisify(fs.writeFile),
      mkdir = promisify(fs.mkdir)

async function generate(number) {
  const problem = await getProblemFromDB(number),
        filename = number + '-' + problem.lowTitle + '.js',
        filePath = path.join(__dirname, '..', 'problems', filename)

  if (fs.existsSync(filePath)) exit('File <' + filename + '> already exists.')

  // requestProblem 访问不到内容
  const description = await requestProblem(problem)
  const header = '// ' + number + '. ' + problem.title + '\n' +
        '// ' + problem.difficulty + '   ' + problem.acceptance + '%\n'

  await writeFile(filePath, header + description, 'utf8')
  console.log('Generate File: <' + filename + '>.')
}

async function getProblemFromDB(number) {
  const problem = (await selectBy(parseInt(number)))[0]

  if (!problem) exit('Do not have this problem.')
  if (problem.locked) exit('This problem is LOCKED!')

  problem.lowTitle = toLowTitle(problem.title)
  return problem
}

// FIXME: request 访问不到内容，可能需要深入爬虫了。
async function requestProblem(problem) {
  function requestAsync(url, options) {
    return new Promise((resolve, reject) => {
      request(url, options, function(err, res, body) {
        if (err) reject(err)
        resolve(body)
      })
    })
  }

  const cacheDir = path.join(__dirname, 'cache')
  if (!fs.existsSync(cacheDir)) await mkdir(cacheDir)

  const cachePath = path.join(cacheDir, problem.title + '.html')
  if (fs.existsSync(cachePath)) {
    const cache = await readFile(cachePath)
    console.log('Read from cache')
    return getDescription(cache)
  }

  const url = 'https://leetcode.com/problems/'+problem.lowTitle+'/description/'
  console.log('start to connect ' + url)
  const body = await requestAsync(url)

  await writeFile(cachePath, body, 'utf8')
  return getDescription(body)
}

function getDescription(body) {
  function unfill(value) {
    if (value === '') return value
    return value
      .split(' ')
      .reduce((lines, word, i) => {
        const tail = lines.length - 1
        if (lines[tail].length + word.length > 80) {
          lines[tail + 1] = '// ' + word
        } else {
          lines[tail] += (i ? ' ' : '// ') + word
        }
        return lines
      }, [''])
      .join('\n')
  }

  const $ = cheerio.load(body)
  const description = $('.question-description')
  description.children('p').each(function(){$(this).text($(this).text() + '\n')})

  return description
    .text()
    .split('\n')
    .map(line => line.trimRight())
    .map(unfill)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n') +
    '\n'
}

function exit(...args) {
  console.log('Generate fails!')
  throw new Error(...args)
}

// TODO request editor content

(function main() {
  if (process.argv[2]) {
    generate(process.argv[2]).catch((err) => console.log(err))
  } else {
    console.log('Please input problem\'s number.')
  }
})()
