export const calculateTool = {
  type: "function",
  function: {
    name: "calculate",
    description: "進行數學計算",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "數學算式",
        },
      },
      required: ["expression"],
    },
  },
};

export function calculate({ expression }) {
  try {
    const result = eval(expression);

    return {
      expression,
      result,
    };
  } catch (error) {
    return {
      error: "計算失敗",
    };
  }
}