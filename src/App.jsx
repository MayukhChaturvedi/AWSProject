import { useState } from "react";
import { Loader2, Volume2 } from "lucide-react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { SnackbarProvider } from "notistack";

const API_URL = import.meta.env.VITE_APIURL;

const voiceMap = {
	"en-US": "Joanna",
	"en-GB": "Amy",
	"es-ES": "Conchita",
	"fr-FR": "Celine",
	"de-DE": "Marlene",
	"it-IT": "Carla",
	"ja-JP": "Takumi",
	"pt-BR": "Camila",
};

function TextToSpeechConverter() {
	const [text, setText] = useState("");
	const [audioUrl, setAudioUrl] = useState("");
	const [selectedLanguage, setSelectedLanguage] = useState("en-US");
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	const handleGenerateAudio = async () => {
		if (!text) {
			enqueueSnackbar("Please enter some text to convert", {
				variant: "warning",
			});
			return;
		}
		
		setLoading(true);
		try {
			const response1 = await axios.post(API_URL, {
				text,
				language: selectedLanguage,
			}, {
				headers: {
					'Content-Type': 'application/json',
				}
			});
			const response = JSON.parse(response1.data.body);
			if (response.audio_file_url) {
				enqueueSnackbar("Audio generated successfully", { variant: "success" });
				// Add a timestamp to the URL to force reload
				const timestamp = new Date().getTime();
				setAudioUrl(`${response.audio_file_url}?t=${timestamp}`);
			} else {
				throw new Error("No audio URL received");
			}
		} catch (error) {
			console.error("Error generating audio:", error);
			enqueueSnackbar(
				error.response?.data?.error ||
				"Error generating audio. Please try again.",
				{ variant: "error" }
			);
			setAudioUrl("");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 p-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl font-bold text-white mb-2">Text to Speech</h1>
					<p className="text-purple-200">
						Convert your text into natural-sounding speech
					</p>
				</div>

				{/* Main Content */}
				<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Left Column */}
						<div className="lg:col-span-2">
							{/* Language Selector */}
							<div className="mb-4">
								<label
									htmlFor="language"
									className="block text-sm font-medium text-purple-200 mb-2"
								>
									Voice & Language
								</label>
								<select
									id="language"
									value={selectedLanguage}
									onChange={(e) => setSelectedLanguage(e.target.value)}
									className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								>
									{Object.entries(voiceMap).map(([lang, voice]) => (
										<option key={lang} value={lang} className="bg-purple-900">
											{voice} ({lang})
										</option>
									))}
								</select>
							</div>

							{/* Text Input */}
							<div>
								<label
									htmlFor="text"
									className="block text-sm font-medium text-purple-200 mb-2"
								>
									Text Input
								</label>
								<textarea
									id="text"
									value={text}
									onChange={(e) => setText(e.target.value)}
									placeholder="Enter your text here (max 250 characters)"
									maxLength={250}
									rows={8}
									className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
								/>
								<div className="mt-2 text-right text-sm text-purple-300">
									{text.length}/250 characters
								</div>
							</div>
						</div>

						{/* Right Column */}
						<div className="flex flex-col justify-between">
							<div className="space-y-4">
								<button
									onClick={handleGenerateAudio}
									disabled={loading || !text}
									className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
								>
									{loading ? (
										<>
											<Loader2 className="animate-spin" size={20} />
											<span>Generating...</span>
										</>
									) : (
										<>
											<Volume2 size={20} />
											<span>Generate Audio</span>
										</>
									)}
								</button>

								{audioUrl && (
									<div className="p-4 bg-white/5 rounded-lg">
										<audio className="w-full" controls src={audioUrl} key={audioUrl} />
									</div>
								)}
							</div>

							<div className="mt-4 p-4 bg-purple-800/20 rounded-lg">
								<h3 className="text-purple-200 font-medium mb-2">Pro Tips</h3>
								<ul className="text-sm text-purple-300 space-y-1">
									<li>• Keep sentences clear and concise</li>
									<li>• Use punctuation for natural pauses</li>
									<li>• Test different voices for best results</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<SnackbarProvider maxSnack={3}>
			<TextToSpeechConverter />
		</SnackbarProvider>
	);
}