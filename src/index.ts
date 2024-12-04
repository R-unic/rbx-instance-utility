import { TweenService, MarketplaceService as Market } from "@rbxts/services";

type Maybe<T> = T | undefined;

export async function getDevProducts() {
	return await getPageContents(Market.GetDeveloperProductsAsync());
}

export async function getPageContents<T extends defined>(pages: Pages<T>, delayBetweenPages = 0): Promise<T[]> {
	return new Promise((resolve, reject) => {
		const contents: T[] = [];
		try {
			while (task.wait(delayBetweenPages)) {
				const page = pages.GetCurrentPage();
				for (const item of page)
					contents.push(item);

				if (pages.IsFinished) break;
				pages.AdvanceToNextPageAsync();
			}
		} catch (err) {
			reject(err);
		}

		resolve(contents);
	});
}

export function tween<T extends Instance = Instance>(
	instance: T,
	tweenInfo: TweenInfo,
	goal: Partial<ExtractMembers<T, Tweenable>>
): Tween {
	const tween = TweenService.Create(instance, tweenInfo, goal);
	tween.Play();

	return tween;
}

export function getDescendantsOfType<T extends keyof Instances, I extends Instances[T] = Instances[T]>(instance: Instance, ...classNames: T[]): I[] {
	return instance.GetDescendants().filter((child): child is I => classNames.some(className => child.IsA(className)));
}

export function getChildrenOfType<T extends keyof Instances, I extends Instances[T] = Instances[T]>(instance: Instance, ...classNames: T[]): I[] {
	return instance.GetChildren().filter((child): child is I => classNames.some(className => child.IsA(className)));
}

export function getCharacterParts(character: Model): BasePart[] {
	return getDescendantsOfType(character, "BasePart");
}

export function getInstanceFromPath<I extends Instance = Instance>(path: string | string[], root: Instance = game): Maybe<I> {
	const pieces = typeOf(path) === "string" ? (<string>path).split(".") : <string[]>path;
	let result: Maybe<Instance> = root;

	for (const piece of pieces)
		result = result?.FindFirstChild(piece);

	return <I>result;
}