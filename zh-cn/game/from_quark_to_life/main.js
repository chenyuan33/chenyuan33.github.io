var flush = ['all'], funcs = {
	get_current_archive: () => {
		document.getElementById('archive').value = btoa(JSON.stringify(player));
	},
	set_current_archive: () => {
		let errmsg = "存档内容有误。", temp = {};
		try {
			temp = JSON.parse(atob(document.getElementById("archive").value));
		} catch (e) {
			alert(errmsg);
			return;
		}
		player = temp;
		flush.push('all');
	},
	shown: (hiddens, shown) => {
		hiddens.forEach(element => {
			document.getElementById(element).className = "hidden";
		});
		document.getElementById(shown).className = "shown";
	},
	TeXstr: num => {
		if (num < 1000) {
			return `${num}`;
		}
		else {
			let lognum = Math.floor(Math.log10(num));
			let x = Math.fround((num / Math.pow(10, lognum)) * 1000);
			let fx = xx => (xx + "").includes(".") ? (xx + "").split(".")[0] : xx + "";
			return `${fx(x / 1000 % 10)}.${fx(x / 100 % 10)}${fx(x / 10 % 10)}${fx(x % 10)}e${lognum}`;
		}
	},
	get_quark: level => {
		document.getElementById(`quarkButton${level}`).disabled = true;
		if (level == player.quark.length - 1) {
			player.quark.push([0, 0]);
		}
		if (!level) {
			player.quark[0]++;
			flush.push('quark');
			return;
		}
		player.quark[0] -= (player.quark[level][1] + 1) * Math.pow(10, level);
		player.quark[level][0]++;
		player.quark[level][1]++;
		flush.push('quark');
	},
	unlock_life: () => {
		player.quark[0] -= 1e30;
		player.unlocks.life = true;
		flush.push('quark');
		flush.push('life');
	},
	how_many_people: () => player.people.unemployed + player.people.farmer,
	convert_person: () => {
		player.quark[0] -= 1e40 * Math.pow(1e10, funcs.how_many_people());
		player.people.unemployed++;
		flush.push('quark');
		flush.push('life');
	}
}, achievements = {
	first_quark: {
		title: "第一步",
		desc: "获得第一个夸克。",
		check: () => player.quark[0] > 0
	},
	quark_getter: {
		title: "速度！",
		desc: "获得一个夸克获取器。",
		check: () => player.quark.length > 1 && player.quark[1][0] > 0
	},
	quark_getter_2nd: {
		title: "加速度！",
		desc: "用获取器获取获取器！（达成条件：获取一个夸克获取器 #2）",
		check: () => player.quark.length > 2 && player.quark[2][0] > 0
	},
	quark_getter_3rd: {
		title: "加加速度！",
		desc: "用获取器获取的获取器获取获取器！（达成条件：获取一个夸克获取器 #3）",
		check: () => player.quark.length > 3 && player.quark[3][0] > 0
	},
	quark_getter_4th: {
		title: "加加加速度！",
		desc: "用获取器获取的获取器获取可以获取获取器的获取器！（达成条件：获取一个夸克获取器 #4）",
		check: () => player.quark.length > 4 && player.quark[4][0] > 0
	},
	quark_1e10: {
		title: "好多夸克！",
		desc: `获得 ${funcs.TeXstr(1e10)} 夸克。`,
		check: () => player.quark[0] >= 1e10
	},
	quark_1e15: {
		title: "更多夸克！",
		desc: `获得 ${funcs.TeXstr(1e15)} 夸克。`,
		check: () => player.quark[0] >= 1e15
	},
	quark_1e20: {
		title: "超多夸克！",
		desc: `获得 ${funcs.TeXstr(1e20)} 夸克。`,
		check: () => player.quark[0] >= 1e20
	},
	quark_1e25: {
		title: "这是什么？",
		desc: `获得 ${funcs.TeXstr(1e25)} 夸克。`,
		check: () => player.quark[0] >= 1e25
	},
	life_unlocked: {
		title: "我是人类！",
		desc: "开始生活。",
		check: () => player.unlocks.life
	},
	have_wood: {
		title: "要致富，先撸树",
		desc: "获得一块木头。",
		check: () => player.wood > 0
	},
	have_food: {
		title: "民以食为天",
		desc: "获得一个食物。",
		check: () => player.food > 0
	},
	have_person: {
		title: "我是王！",
		desc: "获得一个人类。",
		check: () => funcs.how_many_people() > 0
	},
	adam_and_eve: {
		title: "亚当与夏娃",
		desc: "获得两个人类。",
		check: () => funcs.how_many_people() >= 2
	},
	farm: {
		title: "开垦荒地",
		desc: "拥有一个农场。",
		check: () => player.farm > 0
	},
	farmer: {
		title: "农民",
		desc: "让一个人成为农民。",
		check: () => player.people.farmer > 0
	},
	people_machine: {
		title: "人机",
		desc: "解锁人类机器",
		check: () => player.unlocks.people_machine
	},
	the_end: {
		title: "结束了",
		desc: `获得 ${funcs.TeXstr(1e30)} 人。`,
		check: () => funcs.how_many_people() >= 1e30
	}
}, unlocks_check = {
	food: {
		check: () => player.wood >= 1,
		flush: "life"
	},
	farm: {
		check: () => player.wood >= 10,
		flush: "life"
	},
	people_machine: {
		check: () => funcs.how_many_people() >= 100,
		flush: "life"
	}
}, player = {
	achievements: {
		first_quark: false,
		quark_getter: false,
		quark_getter_2nd: false,
		quark_getter_3rd: false,
		quark_getter_4th: false,
		quark_1e10: false,
		quark_1e15: false,
		quark_1e20: false,
		quark_1e25: false,
		life_unlocked: false,
		have_wood: false,
		have_food: false,
		have_people: false,
		adam_and_eve: false,
		farm: false,
		farmer: false,
		people_machine: false,
		the_end: false
	},
	unlocks: {
		life: false,
		food: false,
		farm: false,
		people_machine: false
	},
	quark: [0],
	wood: 0,
	food: 0,
	farm: 0,
	people: {
		unemployed: 0,
		farmer: 0,
	},
	start_people_machine: false
};
function mainloop() {
	setInterval(() => {
		while (flush.length > 0) {
			switch (flush[0]) {
				case 'all':
					flush.push('achievements');
					flush.push('quark');
					flush.push('life');
					break;
				case 'achievements': {
					let str = `
						<h2>成就</h2>
					`;
					for (let key in achievements) {
						str += `
							<p class="achievement-${player.achievements[key] ? "" : "un"}getted">
								${achievements[key].title}
								<p class="achievement-desc">${achievements[key].desc}</p>
							</p>
						`;
					}
					document.getElementById("achievements").innerHTML = str;
					break;
				}
				case 'quark': {
					let str = `
						<h2>你有 ${funcs.TeXstr(player.quark[0])} 夸克</h2>
						<button onclick="funcs.get_quark(0)" id="quarkButton0">获取一个</button>
					`;
					if (player.unlocks.life) {
						str += `
							<button onclick="funcs.convert_person()"${1e40 * Math.pow(1e10, funcs.how_many_people()) <= player.quark[0] ? "" : " disabled"}>
								花费 ${funcs.TeXstr(1e40 * Math.pow(1e10, funcs.how_many_people()))} 转换一个到人类
							</button>
						`;
					}
					else if (player.quark[0] >= 1e25) {
						str += `
							<button onclick="funcs.unlock_life()"${player.quark[0] >= 1e30 ? "" : " disabled"}>
								花费 ${funcs.TeXstr(1e30)} 解锁 ${player.quark[0] >= 1e30 ? "人类" : "下一阶段"}
							</button>
						`;
					}
					str += `
						<table>
							<tr>
								<th>获取器</th>
								<th>拥有数量</th>
								<th>购买数量</th>
								<th>获取一个</th>
							</tr>
					`;
					for (let i = 1; i < player.quark.length; i++) {
						str += `
							<tr>
								<td>#${funcs.TeXstr(i)}</td>
								<td>${funcs.TeXstr(player.quark[i][0])}</td>
								<td>${funcs.TeXstr(player.quark[i][1])}</td>
								<td><button onclick="funcs.get_quark(${i})" id="quarkButton${i}" ${(player.quark[i][1] + 1) * Math.pow(10, i)
								<= player.quark[0] ? "" : "disabled"
							}>
									花费 ${funcs.TeXstr((player.quark[i][1] + 1) * Math.pow(10, i))} 夸克获取一个
								</button></td>
							</tr>
						`;
					}
					document.getElementById("quark").innerHTML = str + `
						</table>
					`;
					document.getElementById("quarkButton").innerHTML = `夸克 (${funcs.TeXstr(player.quark[0])})`;
					break;
				}
				case 'life': {
					if (!player.unlocks.life) {
						break;
					}
					if (player.unlocks.life) {
						if (document.getElementById("life") === null) {
							let life = document.createElement("div");
							life.class = "hidden";
							life.id = "life";
							document.getElementById("main").appendChild(life);
							let lifeButton = document.createElement("button");
							lifeButton.innerHTML = "生活";
							lifeButton.onclick = () => funcs.shown(["quark", "life"], "life");
							document.getElementById("main").insertBefore(lifeButton, document.getElementById("quark"));
							document.getElementById("quarkButton").onclick = () => funcs.shown(["quark", "life"], "quark");
						}
					}
					let str = `<p>木头：${funcs.TeXstr(player.wood)} <button onclick="player.wood++; flush.push('life');">获取一个</button></p>`;
					if (player.unlocks.food) {
						str += `<p>食物：${funcs.TeXstr(player.food)} <button onclick="player.food++; flush.push('life');">获取一个</button></p>`;
					}
					if (player.unlocks.farm) {
						str += `
							<p>
								农田：${funcs.TeXstr(player.farm)}
								<button
									onclick="player.farm++; player.wood -= (player.farm + 1) * 10; flush.push('life');"
									${player.wood >= (player.farm + 1) * 10 ? "" : "disabled"}
								>
									开垦一片
								</button>
							</p>
						`;
					}
					str += `
						<p>人类：</p>
						<ul>
							<li>无业：${funcs.TeXstr(player.people.unemployed)}</li>
					`;
					if (player.unlocks.farm) {
						str += `
							<li>
								农民：${funcs.TeXstr(player.people.farmer)}
								<button
									onclick="player.people.farmer--; player.people.unemployed++; flush.push('life');"
									${player.people.farmer > 0 ? "" : "disabled"}
								>-</button>
								<button
									onclick="player.people.farmer++; player.people.unemployed--; flush.push('life');"
									${player.people.unemployed > 0 ? "" : "disabled"}
								>+</button>
							</li>
						`;
					}
					str += "</ul>";
					if (player.unlocks.people_machine) {
						str += `
							<p>人类机器 <button onclick="player.start_people_machine = true;">启动</button></p>
						`;
					}
					document.getElementById("life").innerHTML = str;
					break;
				}
				default:
					break;
			}
			flush.shift();
		}
	}, 50);
	setInterval(() => {
		if (player.quark.length > 1 && player.quark[1][0] > 0) {
			player.quark[0] += player.quark[1][0];
			for (let i = 1; i < player.quark.length - 1; i++) {
				player.quark[i][0] += player.quark[i + 1][0];
			}
			flush.push('quark');
		}
	}, 1000);
	setInterval(() => {
		for (let key in achievements) {
			if (!player.achievements[key] && achievements[key].check()) {
				update = true;
				player.achievements[key] = true;
				document.getElementById("hadAchievements").style.display = "block";
				document.getElementById("hadAchievements").innerHTML = `
					<h2>获得成就：${achievements[key].title}</h2>
					<p>${achievements[key].desc}</p>
				`;
				setTimeout(() => document.getElementById("hadAchievements").style.display = "none", 5000);
			}
		}
		flush.push('achievements');
		if (player.start_people_machine && player.quark[0] >= funcs.TeXstr(1e40 * Math.pow(1e10, funcs.how_many_people()))) {
			player.people.unemployed++;
			player.quark[0] -= funcs.TeXstr(1e40 * Math.pow(1e10, funcs.how_many_people()));
		}
		for (let key in unlocks_check) {
			if (!player.unlocks[key] && unlocks_check[key].check()) {
				player.unlocks[key] = true;
				flush.push(unlocks_check[key].flush);
			}
		}
	}, 50);
};