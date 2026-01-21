type ErrorMap = {
  [errorType: string]: {
    [messageFragment: string]: string;
  };
};

export const errorMap: ErrorMap = {
  ReferenceError: {
    "is not defined": "L Bruh. '{var}' is not defined. Who is that?",
    "cannot access ['\"`]?.+?['\"`]? before initialization":
      "Hold up, you can't use '{var}' before it spawns.",
  },
  TypeError: {
    "is not a function":
      "Bro, '{var}' is not a function. Stop trying to make it cook.",
    "Assignment to constant variable":
      "You said variable was fr. You can't switch up now!",
    "Cannot read properties":
      "Bruh, you're trying to read properties of an NPC (null/undefined).",
    "is not iterable": "You can't spam through '{var}'. It's not a list.",
  },
  SyntaxError: {
    "Unexpected token": "Vibe check failed. Unexpected token: '{token}'",
    "Unexpected identifier": "Who invited '{token}'? Unexpected identifier.",
    "Function statements require a function name":
      "Yo, it needs a name to cook.",
    "Unexpected end of input": "Bro left me on read. Unexpected end of input.",
    "Unexpected string": "Yo, this string shouldn't be here. Delete it.",
  },
  RangeError: {
    "Maximum call stack size exceeded":
      "You cooked too hard and burned the kitchen.",
    "Invalid array length": "That array size is sus. (Invalid array length)",
  },
};
