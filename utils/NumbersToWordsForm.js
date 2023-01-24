const NumbersToWordsForm = (number) => {
  // numbers to words
  const words = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  // tens to words
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  // hundreds to words
  const hundreds = [
    "",
    "One Hundred",
    "Two Hundred",
    "Three Hundred",
    "Four Hundred",
    "Five Hundred",
    "Six Hundred",
    "Seven Hundred",
    "Eight Hundred",
    "Nine Hundred",
  ];

  // finish

  // if number is less than 20
  if (number < 20) {
    return words[number];
  }

  // if number is less than 100
  if (number < 100) {
    return (tens[Math.floor(number / 10)] + " " + words[number % 10]).trim();
  }

  // if number is less than 1000
  if (number < 1000) {
    return (
      hundreds[Math.floor(number / 100)] +
      " " +
      NumbersToWordsForm(number % 100)
    ).trim();
  }
};

export default NumbersToWordsForm;
