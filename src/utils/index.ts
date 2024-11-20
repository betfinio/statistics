export const getDynamicCycles = () => {
	const starts = [1715601600];

	// Constants
	const secondsInWeek = 60 * 60 * 24 * 7; // seconds in one week
	const fourWeeksInterval = secondsInWeek * 4; // 4 weeks in seconds

	// Function to generate full 4-week periods until the current time
	const generateFullFourWeekPeriods = (start: number, currentTime: number) => {
		const fullPeriods: number[] = [];
		let currentStart = start;

		// Loop to generate full 4-week intervals until the current time
		while (currentStart + fourWeeksInterval <= currentTime + fourWeeksInterval) {
			fullPeriods.push(currentStart);
			currentStart += fourWeeksInterval;
		}

		return fullPeriods;
	};

	const now = Date.now() / 1000; // Current time in seconds

	//  full 4-week periods up until the current time
	const fullFourWeekPeriods = generateFullFourWeekPeriods(starts[0], now);

	// The last full period's start and end for cycle calculation
	const cycleStart = fullFourWeekPeriods[fullFourWeekPeriods.length - 1] * 1000; // Start of the last full cycle (in ms)

	const transformedCycles = fullFourWeekPeriods.map((startTime, index) => {
		const start = startTime; // Convert to milliseconds
		const end = index < fullFourWeekPeriods.length - 1 ? fullFourWeekPeriods[index + 1] : Math.floor(Date.now() / 1000);
		return { start, end };
	});
	// Filter out cycles that have a start time after the current cycle's start
	const validCycles = transformedCycles;

	return {
		validCycles,
		cycleStart,
	};
};

const CYCLE_LENGTH_MS = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds
const OFFSET_MS = 1000 * 60 * 60 * 36; // 36 hours in milliseconds

// Calculate the current cycle ID
const cycleId = Math.floor((Date.now() - OFFSET_MS) / CYCLE_LENGTH_MS);

// Calculate the start timestamp for the current cycle
const cycleStart = cycleId * CYCLE_LENGTH_MS + OFFSET_MS;

// Function to get the previous N cycles (backwards)
export const getConservativeCyclesBack = (numCycles: number) => {
	const cycles = [];
	let currentCycleStart = cycleStart;

	for (let i = 0; i < numCycles; i++) {
		// Calculate start and end of the current cycle
		const cycleEnd = currentCycleStart + CYCLE_LENGTH_MS; // End of current cycle is start of the next cycle
		cycles.push({
			start: currentCycleStart / 1000,
			end: cycleEnd / 1000,
		});

		// Move to the previous cycle (subtract one cycle length)
		currentCycleStart -= CYCLE_LENGTH_MS;
	}

	return cycles.reverse(); // Reverse to get cycles in chronological order
};
