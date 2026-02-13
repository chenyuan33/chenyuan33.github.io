let curArray = [], paused = false, stoped = false, algoList = ['bubbleSort', 'selectionSort', 'insertionSort', 'gnomeSort', 'cocktailSort', 'shellSort', 'heapSort', 'mergeSort', 'quickSort', 'bogoSort', 'bogoBogoSort', 'permutationSort', 'slowSort', 'stoogeSort'], genInc = () => {
	let n = document.getElementById('array-size').value, x = document.getElementById('many-duplicated').checked, ret = [];
	for (let i = 0; i < n; i++) {
		ret.push(x ? Math.floor(i / Math.sqrt(n)) + 1 : i + 1);
	}
	return ret;
}, displayArray = () => {
	document.getElementById('visu-box').innerHTML = '';
	for (let i = 0; i < curArray.length; i++) {
		let cur = document.createElement('div');
		cur.classList = 'element-of-visu';
		cur.style.height = curArray[i].num / Math.max.apply(null, curArray.map(v => v.num)) * 100 + '%';
		cur.style.width = 100 / curArray.length + '%';
		cur.style.backgroundColor = curArray[i].color;
		document.getElementById('visu-box').appendChild(cur);
	}
}, whiteArrayDisplay = arr => {
	curArray = [];
	for (let i = 0; i < arr.length; i++) {
		curArray.push({ num: arr[i], color: 'white' });
	}
	displayArray();
}, makeRand = () => {
	let arr = genInc();
	randomShuffle(arr);
	whiteArrayDisplay(arr);
}, makeInc = () => {
	whiteArrayDisplay(genInc());
}, makeDec = () => {
	let arr = genInc();
	arr.reverse();
	whiteArrayDisplay(arr);
}, arrayRemakerDisable = disable => {
	for (let i = 1; i <= 3; i++) {
		document.getElementById(`arrayRemaker${i}`).disabled = disable;
	}
}, checkArraySize = () => {
	arrayRemakerDisable(!Number.isInteger(Number(document.getElementById('array-size').value)) || document.getElementById('array-size').value < 1);
}, updateMergeSortName = () => {
	let v = document.getElementById('mergeSortWayCount').value;
	document.getElementById('mergeSortWayCountDisplay').style.display = Number.isInteger(Number(v)) && v >= 3 ? 'inline' : 'none';
	document.getElementById('mergeSortWayCountDisplayNumber').innerHTML = v;
}, pause = () => {
	if (paused) {
		paused = false;
		document.getElementById('pause').innerHTML = i18n.tool.visualizationOfSortingAlgo.settings.pause;
	}
	else {
		paused = true;
		document.getElementById('pause').innerHTML = i18n.tool.visualizationOfSortingAlgo.settings.continue;
	}
}, stop = () => {
	stoped = true;
	setTimeout(() => stoped = false, 100);
}, tick = () => {
	displayArray();
	return new Promise((resolve, reject) => setTimeout(() => (f = () => {
		if (paused) {
			if (stoped) {
				reject();
			}
			else {
				setTimeout(f, 50);
			}
		}
		else if (stoped) {
			reject();
		}
		else {
			resolve();
		}
	})(), document.getElementById('delay').value));
}, run = async func => {
	try {
		curArray.forEach(ele => ele.color = 'white');
		arrayRemakerDisable(true);
		document.getElementById('mergeSortWayCount').disabled = true;
		document.querySelectorAll('.sortingButton').forEach(ele => ele.disabled = true);
		await func();
		curArray.forEach(ele => ele.color = 'green');
		displayArray();
	}
	catch (exc) {}
	arrayRemakerDisable(false);
	document.getElementById('mergeSortWayCount').disabled = false;
	document.querySelectorAll('.sortingButton').forEach(ele => ele.disabled = false);
}, bubbleSort = async () => {
	for (let i = curArray.length - 1; i >= 0; i--) {
		for (let j = 0; j < i; j++) {
			curArray[j].color = 'red';
			curArray[j + 1].color = 'red';
			await tick();
			if (curArray[j].num > curArray[j + 1].num) {
				[curArray[j].num, curArray[j + 1].num] = [curArray[j + 1].num, curArray[j].num];
			}
			curArray[j].color = 'white';
			curArray[j + 1].color = 'white';
		}
		curArray[i].color = 'green';
	}
}, selectionSort = async () => {
	for (let i = 0; i < curArray.length; i++) {
		let maxx = i;
		for (let j = i; j < curArray.length; j++) {
			curArray[j].color = 'blue';
			curArray[maxx].color = 'red';
			await tick();
			curArray[j].color = 'white';
			curArray[maxx].color = 'white';
			if (curArray[j].num < curArray[maxx].num) {
				maxx = j;
			}
		}
		[curArray[i].num, curArray[maxx].num] = [curArray[maxx].num, curArray[i].num];
		curArray[i].color = 'green';
	}
}, insertionSort = async () => {
	for (let i = 0; i < curArray.length; i++) {
		curArray[i].color = 'red';
		for (let j = i; j >= 0; j--) {
			await tick();
			if (j > 0 && curArray[j].num < curArray[j - 1].num) {
				[curArray[j], curArray[j - 1]] = [curArray[j - 1], curArray[j]];
			}
			else {
				curArray[j].color = 'green';
				break;
			}
		}
	}
}, gnomeSort = async () => {
	for (let i = 0; i < curArray.length;) {
		curArray[i].color = 'red';
		await tick();
		if (i > 0 && curArray[i].num < curArray[i - 1].num) {
			[curArray[i], curArray[i - 1]] = [curArray[i - 1], curArray[i]];
			i--;
		}
		else {
			curArray[i].color = 'green';
			i++;
		}
	}
}, cocktailSort = async () => {
	for (let l = 0, r = curArray.length - 1; l < r; l++, r--) {
		for (let j = l; j < r; j++) {
			curArray[j].color = 'red';
			curArray[j + 1].color = 'red';
			await tick();
			if (curArray[j].num > curArray[j + 1].num) {
				[curArray[j].num, curArray[j + 1].num] = [curArray[j + 1].num, curArray[j].num];
			}
			curArray[j].color = 'white';
			curArray[j + 1].color = 'white';
		}
		curArray[r].color = 'green';
		for (let j = r - 2; j >= l; j--) {
			curArray[j].color = 'red';
			curArray[j + 1].color = 'red';
			await tick();
			if (curArray[j].num > curArray[j + 1].num) {
				[curArray[j].num, curArray[j + 1].num] = [curArray[j + 1].num, curArray[j].num];
			}
			curArray[j].color = 'white';
			curArray[j + 1].color = 'white';
		}
		curArray[l].color = 'green';
	}
}, shellSort = async () => {
	for (let k = Math.floor(curArray.length / 2); k >= 1; k = Math.floor(k / 2)) {
		await tick();
		for (let i = 0; i < curArray.length; i++) {
			for (let j = 0; j < curArray.length; j++) {
				if (j % k == i % k) {
					if (j < i) {
						curArray[j].color = 'green';
					}
					else if (j == i) {
						curArray[j].color = 'red';
					}
					else {
						curArray[j].color = 'blue';
					}
				}
				else {
					curArray[j].color = 'white';
				}
			}
			for (let j = i; j >= 0; j -= k) {
				await tick();
				if (j >= k && curArray[j].num < curArray[j - k].num) {
					[curArray[j], curArray[j - k]] = [curArray[j - k], curArray[j]];
				}
				else {
					curArray[j].color = 'green';
					break;
				}
			}
		}
	}
}, heapSort = async () => {
	let binlen = (x) => {
		let ret = 0;
		while (x) {
			x >>= 1;
			ret++;
		}
		return ret;
	}, color = (i) => {
		curArray[i].color = `hsl(${binlen(i + 1) / binlen(curArray.length) * 360}, 100%, 50%)`;
	};
	async function heapify(n, i) {
		let largest = i, left = 2 * i + 1, right = 2 * i + 2;
		color(i);
		if (left < n) color(left);
		if (right < n) color(right);
		await tick();
		if (left < n && curArray[left].num > curArray[largest].num) {
			largest = left;
		}
		if (right < n && curArray[right].num > curArray[largest].num) {
			largest = right;
		}
		if (largest !== i) {
			[curArray[i], curArray[largest]] = [curArray[largest], curArray[i]];
			await tick();
			color(i);
			color(largest);
			await tick();
			await heapify(n, largest);
		}
		else {
			color(i);
			if (left < n) color(left);
			if (right < n) color(right);
			await tick();
		}
	}
	for (let i = Math.floor(curArray.length / 2) - 1; i >= 0; i--) {
		await heapify(curArray.length);
	}
	for (let i = curArray.length - 1; i > 0; i--) {
		color(0);
		color(i);
		await tick();
		[curArray[0], curArray[i]] = [curArray[i], curArray[0]];
		await tick();
		curArray[i].color = 'green';
		color(0);
		await tick();
		await heapify(i, 0);
    }
}, mergeSort = async () => {
	let k = document.getElementById('mergeSortWayCount').value;
	if (!Number.isInteger(Number(k)) || k < 3) {
		k = 2;
	}
	let fill = (l, r) => {
		for (let i = 0; i <= curArray.length - 1; i++)
		{
			curArray[i].color = i >= l && i <= r ? Math.floor((i - l) / Math.ceil((r - l + 1) / k)) % 2 ? 'yellow' : 'cyan' : 'white';
		}
		return tick();
	}, f = async (l, r) => {
		if (l >= r) {
			if (l == r) {
				curArray[l].color = 'green';
				await tick();
			}
			return;
		}
		let j = [];
		for (let i = 0; i < k; i++) {
			j.push(Math.min(l + Math.ceil((r - l + 1) / k) * i, r));
		}
		j.push(r + 1);
		await fill(l, r);
		for (let i = 0; i < k; i++) {
			await f(j[i], j[i + 1] - 1);
			await fill(l, r);
		}
		let ans = [], j2 = [];
		for (let i = 0; i < k; i++) {
			j2.push(j[i]);
		}
		for (let i = l; i <= r; i++) {
			let p = -1;
			for (let q = 0; q < k; q++) {
				if (j2[q] < j[q + 1] && (p == -1 || curArray[j2[q]].num < curArray[j2[p]].num)) {
					p = q;
				}
			}
			ans.push(curArray[j2[p]++].num);
		}
		for (let i = l; i <= r; i++) {
			curArray[i] = {num: ans[i - l], color: 'green'};
			await tick();
		}
	};
	await f(0, curArray.length - 1);
}, quickSort = async () => {
	let f = async (l, r) => {
		if (l >= r) {
			if (l == r) {
				curArray[l].color = 'green';
				await tick();
			}
			return;
		}
		let i = l, j = r, k = curArray[l].num;
		curArray[i].color = curArray[j].color = 'red';
		await tick();
		while (i < j) {
			while (i < j && curArray[j].num >= k) {
				curArray[j].color = 'white';
				j--;
				curArray[j].color = 'red';
				await tick();
			}
			while (i < j && curArray[i].num <= k) {
				curArray[i].color = 'white';
				i++;
				curArray[i].color = 'red';
				await tick();
			}
			[curArray[i], curArray[j]] = [curArray[j], curArray[i]];
			await tick();
		}
		[curArray[i], curArray[l]] = [curArray[l], curArray[i]];
		curArray[i].color = 'green';
		await tick();
		await f(l, i - 1);
		await f(j + 1, r);
	};
	await f(0, curArray.length - 1);
}, bogoSort = async () => {
	let isSorted = () => {
		for (let i = 0; i < curArray.length - 1; i++) {
			if (curArray[i].num > curArray[i + 1].num) {
				return false;
			}
		}
		return true;
	};
	while (!isSorted()) {
		const i = Math.floor(Math.random() * curArray.length);
		const j = Math.floor(Math.random() * curArray.length);
		curArray[i].color = 'red';
		curArray[j].color = 'red';
		await tick();
		[curArray[i], curArray[j]] = [curArray[j], curArray[i]];
		await tick();
		curArray[i].color = 'white';
		curArray[j].color = 'white';
		await tick();
	}
}, bogoBogoSort = async () => {
	let isSorted = n => {
		for (let i = 0; i < n - 1; i++) {
			if (curArray[i].num > curArray[i + 1].num) {
				return false;
			}
		}
		return true;
	};
	for (let i = 2; i < curArray.length; i++) {
		curArray[i].color = 'gray';
	}
	for (let n = 2; n <= curArray.length; n++) {
		while (!isSorted(n)) {
			const i = Math.floor(Math.random() * n);
			const j = Math.floor(Math.random() * n);
			curArray[i].color = 'red';
			curArray[j].color = 'red';
			await tick();
			[curArray[i], curArray[j]] = [curArray[j], curArray[i]];
			await tick();
			curArray[i].color = 'white';
			curArray[j].color = 'white';
			await tick();
		}
	}
}, permutationSort = async () => {
	let val = [], p = [], nextPermutation = arr => {
		let i = arr.length - 2;
		while (i >= 0 && arr[i] >= arr[i + 1]) {
			i--;
		}
		if (i >= 0) {
			let j = arr.length - 1;
			while (arr[j] <= arr[i]) {
				j--;
			}
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		let left = i + 1;
		let right = arr.length - 1;
		while (left < right) {
			[arr[left], arr[right]] = [arr[right], arr[left]];
			left++;
			right--;
		}
	}, isSorted = () => {
		for (let i = 0; i < curArray.length - 1; i++) {
			if (curArray[i].num > curArray[i + 1].num) {
				return false;
			}
		}
		return true;
	};
	for (let i = 0; i < curArray.length; i++) {
		val.push(curArray[i].num);
		p.push(i);
	}
	while (!isSorted()) {
		nextPermutation(p);
		for (let i = 0; i < curArray.length; i++) {
			val.push(curArray[i].num);
			curArray[i].num = val[p[i]];
		}
		await tick();
	}
}, slowSort = async () => {
	let did = curArray.length, fill = (l, r) => {
		for (let i = 0; i <= curArray.length - 1; i++)
		{
			curArray[i].color = i < did ? i >= l && i <= r ? i <= (l + r >> 1) ? 'yellow' : 'cyan' : 'white' : 'green';
		}
		return tick();
	}, f = async (l, r, mainly = true) => {
		if (l >= r) {
			if (l == r) {
				curArray[l].color = 'green';
				await tick();
			}
			return;
		}
		let mid = l + r >> 1;
		await fill(l, r);
		await f(l, mid, false);
		await fill(l, r);
		await f(mid + 1, r, false);
		await fill(l, r);
		curArray[mid].color = curArray[r].color = 'red';
		if (curArray[mid].num > curArray[r].num) {
			[curArray[mid], curArray[r]] = [curArray[r], curArray[mid]];
		}
		curArray[mid].color = curArray[r].color = 'white';
		if (mainly) {
			did--;
		}
		await f(l, r - 1, mainly);
	};
	await f(0, curArray.length - 1);
}, stoogeSort = async () => {
	let did = curArray.length, fill = (l, r) => {
		let k = Math.floor((r - l + 1) / 3);
		for (let i = 0; i <= curArray.length - 1; i++)
		{
			curArray[i].color = i < did ? i >= l && i <= r ? i <= r - k ? i < l + k ? 'yellow' : 'cyan' : 'purple' : 'white' : 'green';
		}
		return tick();
	}, f = async (l, r) => {
		if (l >= r) {
			if (l == r) {
				curArray[l].color = 'green';
				await tick();
			}
			return;
		}
		if (r - l == 1) {
			curArray[l].color = curArray[r].color = 'red';
			if (curArray[l].num > curArray[r].num) {
				[curArray[l], curArray[r]] = [curArray[r], curArray[l]];
			}
			curArray[l].color = curArray[r].color = 'white';
			await tick();
			return;
		}
		let k = Math.floor((r - l + 1) / 3);
		await fill(l, r);
		await f(l, r - k);
		await fill(l, r);
		await f(l + k, r);
		await fill(l, r);
		await f(l, r - k);
		await fill(l, r);
	};
	await f(0, curArray.length - 1);
};