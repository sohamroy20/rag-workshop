export const DEFAULT_INSERT_BATCH_SIZE = 500;
export var SIMPLE_MODELS;
(function (SIMPLE_MODELS) {
    SIMPLE_MODELS[SIMPLE_MODELS["OPENAI_GPT3.5_TURBO"] = 0] = "OPENAI_GPT3.5_TURBO";
    SIMPLE_MODELS[SIMPLE_MODELS["OPENAI_GPT4_TURBO"] = 1] = "OPENAI_GPT4_TURBO";
    SIMPLE_MODELS[SIMPLE_MODELS["OPENAI_GPT4_O"] = 2] = "OPENAI_GPT4_O";
})(SIMPLE_MODELS || (SIMPLE_MODELS = {}));
export var SIMPLE_RANKERS;
(function (SIMPLE_RANKERS) {
    SIMPLE_RANKERS[SIMPLE_RANKERS["COHERE_RERANK"] = 0] = "COHERE_RERANK";
})(SIMPLE_RANKERS || (SIMPLE_RANKERS = {}));
