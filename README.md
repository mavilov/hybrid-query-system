# Interview Task: Building a Hybrid Query System (No Frameworks)

_See the original assignment PDF under `docs` folder._

## Objective

We'd like you to design and implement a system that can answer user questions by intelligently querying both a structured database (SQL) and an unstructured text corpus (via vector search). The key challenge is to do this without relying on existing LLM frameworks like Langchain, LlamaIndex, etc. You will need to implement the core logic for query understanding, decomposition, data retrieval, and answer synthesis.

## System Requirements

1. Input: The system should accept a natural language question from the user.
2. Outputs: This final step should synthesize the information and generate a coherent, natural language answer to the user's original question.

## Implementation Notes

- No Frameworks: You must not use libraries like Langchain, Haystack, LlamaIndex, or any other comprehensive RAG/LLM agent frameworks. Standard libraries for database interaction (e.g. `sqlite3`), numerical operations (e.g., `numpy` for vector math if needed), and basic text processing are acceptable.
- Frontend: A command-line interface (CLI) for interaction is perfectly acceptable.
- Focus: The emphasis is on your understanding of the components of such a system, the logic flow, and how you would approach building it from more fundamental pieces.

## Demonstration & Discussion

During our meeting, we'd like you to:

1. Demonstrate your system with a few example questions.
2. Talk us through your implementation: Explain your design choices, the logic for query decomposition, data retrieval, result combination, and answer synthesis.
3. Discuss the challenges you encountered while building this system from scratch, particularly in the absence of high-level frameworks.

## Q & A

After reading the task description I collected and sent to Snyk these questions, and they were addressed.

**Q:** I can freely select data domain, correct? As an example, we can talk about company data. I can have structured data in SQL for users and their orders. Also, I can have a text corpus with company policies, warranty, liability, etc. Or it could be something closer to Snyk business: structured data about well-defined vulnerabilities in 3rd-party libraries, and unstructured data from "hacker news”.

**A:** Yes the data can be freely selected. Both examples are fine.

**Q:** Can I use an LLM API for the query decomposition? If not, the task is much harder. If I cannot use an LLM API for decomposition, what is the expectation? My plan is to build a keyword/rule-based router to classify a query as 'SQL', 'Vector', or 'Hybrid' and extract entities. Is this the core logic you are looking for?

**A:** Using an LLM API for query decomposition is fine.

**Q:** If yes, for 'query understanding’ I will use a rule-based router that detects specific patterns (e.g., 'who bought', 'what is'). I am assuming it's more important to show this component exists and can route 2-3 specific examples, rather than building a complex parser that tries to understand all of English. Is that correct?

**A:** Up to the candidate to decide what yields a good outcome for a reasonable time investment.

**Q:** Another assumption: English-only

**A:** Yes English-only is fine.

**Q:** I am not planning to build a full natural-language-to-SQL generator. Is this a good assumption? Then my demo would look for specific language patterns.

**A:** These choices are part of the task, therefore, we cannot comment on this one

**Q:** Do you expect me to build TF-IDF implementation to calculate embeddings? Should I look into using 3rd-party vector search implementation, like MongoDB Atlas?

**A:** These choices are part of the task & up to you

**Q:** I will try to use JavaScript/Node as this is my most recent stack

**A:** It's up to you to decide this stack :)
