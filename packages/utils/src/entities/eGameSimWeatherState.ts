import { type InferInput, intersect, parse, pick } from "valibot";
import { VDbCities, VDbGames } from "../types";
import type {
	TGameSimWeatherConditions,
	TPicklistGameSimWeatherWindDirection,
} from "../types/tGameSim";

const VConstructorGameSimWeatherState = intersect([
	pick(VDbCities, ["latitude", "longitude"]),
	pick(VDbGames, ["dateTime"]),
]);
type TConstructorGameSimWeatherState = InferInput<
	typeof VConstructorGameSimWeatherState
>;

class GameSimWeatherState {
	private dateTime: string;
	private lastWeather: TGameSimWeatherConditions | null = null;
	private lastUpdateTime = 0;
	private latitude: number;
	private longitude: number;

	constructor(_input: TConstructorGameSimWeatherState) {
		const input = parse(VConstructorGameSimWeatherState, _input);

		this.dateTime = input.dateTime;
		this.latitude = input.latitude;
		this.longitude = input.longitude;
	}

	private _limitWindDirectionChange(
		current: number,
		target: number,
		maxDelta: number,
	): number {
		// Calculate the shortest distance between angles
		let delta = ((target - current + 540) % 360) - 180;

		// Limit the change to maxDelta
		delta = Math.min(Math.abs(delta), maxDelta) * Math.sign(delta);

		// Return new direction ensuring it stays in 0-359 range
		return (current + delta + 360) % 360;
	}

	private _evolveWeather(
		baseWeather: TGameSimWeatherConditions,
		timeDiffMinutes: number,
	): TGameSimWeatherConditions {
		if (!this.lastWeather) return baseWeather;

		// Maximum changes allowed per minute
		const maxChanges = {
			cloudCover: 0.5,
			humidity: 0.2,
			precipitation: 1,
			temperature: 0.05,
			windDirection: 0.5,
			windSpeed: 0.1,
		};

		// Calculate maximum allowed changes based on time passed
		const maxChange = (rate: number) => rate * timeDiffMinutes;

		// Helper to limit change
		const limitChange = (current: number, target: number, maxDelta: number) => {
			const delta = target - current;
			const limitedDelta =
				Math.min(Math.abs(delta), maxDelta) * Math.sign(delta);
			return current + limitedDelta;
		};

		const newWindDirection = this._limitWindDirectionChange(
			this.lastWeather.windDirection,
			baseWeather.windDirection,
			maxChange(maxChanges.windDirection),
		);

		return {
			...baseWeather,
			cloudCover: limitChange(
				this.lastWeather.cloudCover,
				baseWeather.cloudCover,
				maxChange(maxChanges.cloudCover),
			),
			humidity: limitChange(
				this.lastWeather.humidity,
				baseWeather.humidity,
				maxChange(maxChanges.humidity),
			),
			precipitation: limitChange(
				this.lastWeather.precipitation,
				baseWeather.precipitation,
				maxChange(maxChanges.precipitation),
			),
			temperature: limitChange(
				this.lastWeather.temperature,
				baseWeather.temperature,
				maxChange(maxChanges.temperature),
			),
			windDirection: newWindDirection,
			windDescription: this._getWindDescription(newWindDirection),
			windSpeed: limitChange(
				this.lastWeather.windSpeed,
				baseWeather.windSpeed,
				maxChange(maxChanges.windSpeed),
			),
		};
	}

	private _getBaseWeather() {
		const date = new Date(this.dateTime);
		const dayOfYear = Math.floor(
			(date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
				(1000 * 60 * 60 * 24),
		);
		const hour = date.getHours();

		const latitudeTemp =
			Math.cos((Math.abs(this.latitude) * Math.PI) / 180) * 40;
		const seasonalEffect =
			Math.cos(((dayOfYear - 172) * 2 * Math.PI) / 365) *
			(Math.abs(this.latitude) / 45);
		const dailyVariation = Math.sin(((hour - 6) * Math.PI) / 12) * 10;
		const baseTemp = 20 + latitudeTemp - seasonalEffect * 20 + dailyVariation;

		const isCoastal =
			Math.abs(this.longitude) < 10 || Math.abs(this.longitude) > 170;
		const humidityBase = isCoastal ? 70 : 50;
		const precipChance = isCoastal ? 40 : 25;

		const baseWind =
			(Math.abs(this.latitude) / 45) * 15 + Math.sin((hour * Math.PI) / 12) * 5;

		return {
			baseTemp,
			cloudCoverChance: humidityBase,
			humidity: humidityBase + (Math.random() * 20 - 10),
			precipChance,
			windSpeed: baseWind + Math.random() * 5,
		};
	}

	private _getGlobalWindPattern(): { direction: number; name: string } {
		if (this.latitude > 60) {
			return { direction: 270, name: "Polar Easterlies" };
		}
		if (this.latitude > 30) {
			return { direction: 90, name: "Westerlies" };
		}
		if (this.latitude > 0) {
			return { direction: 270, name: "Trade Winds" };
		}
		if (this.latitude > -30) {
			return { direction: 270, name: "Trade Winds" };
		}
		if (this.latitude > -60) {
			return { direction: 90, name: "Westerlies" };
		}
		return { direction: 270, name: "Polar Easterlies" };
	}

	private _getLocalWindEffects(): { direction: number; intensity: number } {
		const hour = new Date(this.dateTime).getHours();
		const isCoastal =
			Math.abs(this.longitude) < 10 || Math.abs(this.longitude) > 170;

		if (isCoastal) {
			const isDaytime = hour >= 6 && hour <= 18;
			const seaBreeze = isDaytime ? 90 : 270;
			return {
				direction: seaBreeze,
				intensity: isDaytime ? 1.5 : 0.7,
			};
		}

		return {
			direction: 0,
			intensity: 1.0,
		};
	}

	private _calculateWindDirection(): number {
		const globalWind = this._getGlobalWindPattern();
		const localEffect = this._getLocalWindEffects();

		const windDirection = (globalWind.direction + localEffect.direction) / 2;
		const randomVariation = Math.floor(Math.random() * 60) - 30;

		return Math.floor(windDirection + randomVariation + 360) % 360;
	}

	private _getWindDescription(
		degrees: number,
	): TPicklistGameSimWeatherWindDirection {
		const directions = [
			{ min: 337.5, max: 360, name: "N" },
			{ min: 0, max: 22.5, name: "N" },
			{ min: 22.5, max: 67.5, name: "NE" },
			{ min: 67.5, max: 112.5, name: "E" },
			{ min: 112.5, max: 157.5, name: "SE" },
			{ min: 157.5, max: 202.5, name: "S" },
			{ min: 202.5, max: 247.5, name: "SW" },
			{ min: 247.5, max: 292.5, name: "W" },
			{ min: 292.5, max: 337.5, name: "NW" },
		] as const;

		return (
			directions.find(
				(dir) =>
					(degrees >= dir.min && degrees < dir.max) ||
					(dir.name === "N" && degrees >= 337.5),
			)?.name || "N"
		);
	}

	public getWeather({
		dateTime,
		forceUpdate = false,
	}: { dateTime: string; forceUpdate?: boolean }): TGameSimWeatherConditions {
		// Update internal dateTime
		this.dateTime = dateTime;

		const currentTime = new Date(this.dateTime).getTime();
		const timeDiff = (currentTime - this.lastUpdateTime) / (1000 * 60); // Convert to minutes

		// If it's been less than 5 minutes and we're not forcing an update, return last weather
		if (this.lastWeather && timeDiff < 5 && !forceUpdate) {
			return this.lastWeather;
		}

		const base = this._getBaseWeather();
		const windDirection = this._calculateWindDirection();

		let weather: TGameSimWeatherConditions = {
			cloudCover:
				Math.random() * 100 < base.cloudCoverChance
					? Math.floor(30 + Math.random() * 70)
					: Math.floor(Math.random() * 30),
			humidity: Math.floor(base.humidity),
			precipitation:
				Math.random() * 100 < base.precipChance
					? Math.floor(Math.random() * 100)
					: 0,
			snow:
				base.baseTemp < 2 && Math.random() < 0.3
					? Math.floor(Math.random() * 100)
					: 0,
			temperature: Math.round(base.baseTemp + (Math.random() * 4 - 2)),
			windDescription: this._getWindDescription(windDirection),
			windDirection,
			windSpeed: Math.round(base.windSpeed + (Math.random() * 4 - 2)),
		};

		if (weather.temperature > 2) {
			weather.snow = 0;
		}

		if (weather.precipitation > 0) {
			weather.humidity = Math.min(100, weather.humidity + 20);
			weather.cloudCover = Math.max(weather.cloudCover, 75);
		}

		// Evolve from previous weather if it exists
		if (this.lastWeather) {
			weather = this._evolveWeather(weather, timeDiff);
		}

		// Update last weather and time
		this.lastWeather = weather;
		this.lastUpdateTime = currentTime;

		return weather;
	}
}

export default GameSimWeatherState;
