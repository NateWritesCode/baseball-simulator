import {
	// type Llama,
	LlamaChatSession,
	// type LlamaContext,
	// type LlamaModel,
	getLlama,
	resolveModelFile,
} from "node-llama-cpp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsDirectory = path.join(__dirname, "models");

class Ai {
	private constructor(private session: LlamaChatSession) {}

	static async init(): Promise<Ai> {
		const modelPath = await resolveModelFile(
			"https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf",
			modelsDirectory,
		);

		const llama = await getLlama();
		const model = await llama.loadModel({ modelPath });

		const context = await model.createContext();
		const session = new LlamaChatSession({
			contextSequence: context.getSequence(),
		});

		// Create and return a new instance with the initialized values
		return new Ai(session);
	}

	public async prompt(q: string) {
		return await this.session.prompt(q);
	}
}

export default Ai;
