// Sample input data (10 lines)
const data = [
  "Hello, World!",
  "This is a test.",
  "Huffman compression.",
  "Example data for compression.",
  "Line 5 with some text.",
  "Short line.",
  "Another example.",
  "More data to compress.",
  "Line number 9.",
  "Last line of data."
];

// Select the index to compress (e.g., first character)
const selectedIndex = 0;

// Function to build a frequency table for the selected index
function buildFrequencyTable(data, index) {
  const frequencyTable = new Map();
  for (const line of data) {
    if (line.length > index) {
      const char = line[index];
      if (!frequencyTable.has(char)) {
        frequencyTable.set(char, 0);
      }
      frequencyTable.set(char, frequencyTable.get(char) + 1);
    }
  }
  return frequencyTable;
}

// Function to build a Huffman tree from a frequency table
function buildHuffmanTree(frequencyTable) {
  const nodes = Array.from(frequencyTable.entries()).map(([char, freq]) => ({
    char,
    freq,
    left: null,
    right: null
  }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const mergedNode = {
      char: '',
      freq: left.freq + right.freq,
      left,
      right
    };
    nodes.push(mergedNode);
  }

  return nodes[0];
}

// Function to encode data using Huffman coding
function encodeData(data, huffmanTree, index) {
  const encodedData = data.map(line => {
    if (line.length > index) {
      const char = line[index];
      return huffmanEncode(char, huffmanTree);
    } else {
      return '';
    }
  });
  return encodedData;
}

// Function to perform Huffman encoding of a single character
function huffmanEncode(char, huffmanTree) {
  let encoded = '';
  const encodeRecursive = (node, path) => {
    if (!node) return;
    if (!node.left && !node.right && node.char === char) {
      encoded = path;
    }
    encodeRecursive(node.left, path + '0');
    encodeRecursive(node.right, path + '1');
  };
  encodeRecursive(huffmanTree, '');
  return encoded;
}

// Function to decode Huffman-encoded data
function decodeData(encodedData, huffmanTree) {
  const decodedData = encodedData.map(encodedLine => huffmanDecode(encodedLine, huffmanTree));
  return decodedData.join('');
}

// Function to perform Huffman decoding of a single line
function huffmanDecode(encodedLine, huffmanTree) {
  let decoded = '';
  let currentNode = huffmanTree;
  for (let bit of encodedLine) {
    if (bit === '0') {
      currentNode = currentNode.left;
    } else if (bit === '1') {
      currentNode = currentNode.right;
    }
    if (!currentNode.left && !currentNode.right) {
      decoded += currentNode.char;
      currentNode = huffmanTree;
    }
  }
  return decoded;
}

// Build the frequency table, Huffman tree, and encode data
const frequencyTable = buildFrequencyTable(data, selectedIndex);
const huffmanTree = buildHuffmanTree(frequencyTable);
const encodedData = encodeData(data, huffmanTree, selectedIndex);

// Print the compressed data
console.log("Compressed Data:");
console.log(encodedData);

// Decode and verify the data
const decodedData = decodeData(encodedData, huffmanTree);
console.log("Decompressed Text:", decodedData);

/*
Compressed Data:
[
  '110', '000', '110',
  '001', '10',  '010',
  '011', '111', '10',
  '10',  '111'
]
Decompressed Text: HTHELSAMLLM
*/
