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
	do_hard_reset: () => {
		player = {
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
				quark_dimension_1: false,
				quark_dimension_1_getted_2: false,
				quark_dimension_1_getter: false,
				quark_dimension_1_getter_2nd: false,
				quark_dimension_1_getter_3rd: false,
				quark_dimension_1_getter_4th: false,
				quark_dimension_2: false,
				quark_dimension_2_getter_4th: false,
				quark_dimension_3: false,
				quark_dimension_4: false,
				the_end: false
			},
			quark: [[0]],
			quark_points: [0],
			unlock_dimension: false
		};
		flush.push('all');
	},
	hard_reset: () => {
		if (confirm("你确定要重置你的进度吗？这将会导致丢失所有游戏数据和成就。如果你想要备份存档，请先点击“取消”，然后在读档/存档界面获取并保存。")) {
			funcs.do_hard_reset();
		}
	},
	get_quark: (dimension, level) => {
		document.getElementById(`quarkButton${dimension}-${level}`).disabled = true;
		if (dimension == player.quark.length - 1) {
			player.quark.push([0]);
			player.quark_points.push(0);
		}
		if (level == player.quark[dimension].length - 1) {
			player.quark[dimension].push([0, 0]);
		}
		if (!level) {
			player.quark[dimension][0]++;
			flush.push('quark');
			return;
		}
		player.quark[dimension][0] -= Math.pow(2, player.quark[dimension][level][1]) * Math.pow(10, level) * Math.pow(20, dimension);
		player.quark[dimension][level][0]++;
		player.quark[dimension][level][1]++;
		flush.push('quark');
	},
	get_quark_max: (dimension, level) => {
		document.getElementById(`quarkButtonMax${dimension}-${level}`).disabled = true;
		if (dimension == player.quark.length - 1) {
			player.quark.push([0]);
			player.quark_points.push(0);
		}
		if (level == player.quark[dimension].length - 1) {
			player.quark[dimension].push([0, 0]);
		}
		while (player.quark[dimension][0] >= Math.pow(2, player.quark[dimension][level][1]) * Math.pow(10, level) * Math.pow(20, dimension))
		{
			player.quark[dimension][0] -= Math.pow(2, player.quark[dimension][level][1]) * Math.pow(10, level) * Math.pow(20, dimension);
			player.quark[dimension][level][0]++;
			player.quark[dimension][level][1]++;
		}
		flush.push('quark');
	},
	get_quark_max_dimension: dimension => {
		document.getElementById(`quarkButtonMaxDimension${dimension}`).disabled = true;
		if (dimension == player.quark.length - 1) {
			player.quark.push([0]);
			player.quark_points.push(0);
		}
		for (let i = 1; i < player.quark[dimension].length; i++) {
			while (player.quark[dimension][0] >= Math.pow(2, player.quark[dimension][i][1]) * Math.pow(10, i) * Math.pow(20, dimension))
			{
				if (i == player.quark[dimension].length - 1) {
					player.quark[dimension].push([0, 0]);
				}
				player.quark[dimension][0] -= Math.pow(2, player.quark[dimension][i][1]) * Math.pow(10, i) * Math.pow(20, dimension);
				player.quark[dimension][i][0]++;
				player.quark[dimension][i][1]++;
			}
		}
		flush.push('quark');
	},
	get_quark_max_all: () => {
		document.getElementById("quarkButtonMaxAll").disabled = true;
		for (let i = 0; i < player.quark.length; i++) {
			for (let j = 1; j < player.quark[i].length; j++) {
				while (player.quark[i][0] >= Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i)) {
					if (i == player.quark.length - 1) {
						player.quark.push([0]);
						player.quark_points.push(0);
					}
					if (j == player.quark[i].length - 1) {
						player.quark[i].push([0, 0]);
					}
					player.quark[i][0] -= Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i);
					player.quark[i][j][0]++;
					player.quark[i][j][1]++;
				}
			}
		}
		flush.push('quark');
	},
	convert_quark: dimension => {
		document.getElementById(`convertQuarkButton${dimension}`).disabled = true;
		if (dimension == player.quark.length - 1) {
			player.quark.push([0]);
			player.quark_points.push(0);
		}
		if (player.quark[dimension + 1].length == 1) {
			player.quark[dimension + 1].push([0, 0]);
		}
		player.quark[dimension + 1][0] += Math.floor(player.quark[dimension][0] / Math.pow(10, (dimension + 3) * 10));
		player.quark[dimension] = [0];
		player.unlock_dimension = true;
		flush.push('quark');
	}
}, achievements = {
	first_quark: {
		title: "第一步",
		desc: "获得第一个夸克。",
		check: () => player.quark[0][0] > 0
	},
	quark_getter: {
		title: "速度！",
		desc: "获得一个夸克获取器。",
		check: () => player.quark[0].length > 1 && player.quark[0][1][0] > 0
	},
	quark_getter_2nd: {
		title: "加速度！",
		desc: "用获取器获取获取器！（达成条件：获取一个夸克获取器 #2）",
		check: () => player.quark[0].length > 2 && player.quark[0][2][0] > 0
	},
	quark_getter_3rd: {
		title: "加加速度！",
		desc: "用获取器获取的获取器获取获取器！（达成条件：获取一个夸克获取器 #3）",
		check: () => player.quark[0].length > 3 && player.quark[0][3][0] > 0
	},
	quark_getter_4th: {
		title: "加加加速度！",
		desc: "用获取器获取的获取器获取可以获取获取器的获取器！（达成条件：获取一个夸克获取器 #4）",
		check: () => player.quark[0].length > 4 && player.quark[0][4][0] > 0
	},
	quark_1e10: {
		title: "好多夸克！",
		desc: `获得 ${funcs.TeXstr(1e10)} 夸克。`,
		check: () => player.quark[0][0] >= 1e10
	},
	quark_1e15: {
		title: "更多夸克！",
		desc: `获得 ${funcs.TeXstr(1e15)} 夸克。`,
		check: () => player.quark[0][0] >= 1e15
	},
	quark_1e20: {
		title: "超多夸克！",
		desc: `获得 ${funcs.TeXstr(1e20)} 夸克。`,
		check: () => player.quark[0][0] >= 1e20
	},
	quark_1e25: {
		title: "这是什么？",
		desc: `获得 ${funcs.TeXstr(1e25)} 夸克。`,
		check: () => player.quark[0][0] >= 1e25
	},
	quark_dimension_1: {
		title: "另一维度！",
		desc: "获得一个拥有维度 1 的夸克。",
		check: () => player.quark.length > 1 && player.quark[1][0] > 0
	},
	quark_dimension_1_getted_2: {
		title: "重头再来一遍！",
		desc: "拥有两个维度 1 的夸克。",
		check: () => player.quark.length > 1 && player.quark[1][0] > 1
	},
	quark_dimension_1_getter: {
		title: "速度提升之另一种方式：夸克点数",
		desc: "获得一个维度 1 的夸克获取器。",
		check: () => player.quark.length > 1 && player.quark[1].length > 1 && player.quark[1][1][0] > 0
	},
	quark_dimension_1_getter_2nd: {
		title: "加速度之夸克点数",
		desc: "获得一个维度 1 的二阶夸克获取器。",
		check: () => player.quark.length > 1 && player.quark[1].length > 2 && player.quark[1][2][0] > 0
	},
	quark_dimension_1_getter_3rd: {
		title: "夸克点数与加加速度",
		desc: `让夸克点数指数增长！（达成条件：获取一个维度 1 的三阶夸克获取器）`,
		check: () => player.quark.length > 1 && player.quark[1].length > 3 && player.quark[1][3][0] > 0
	},
	quark_dimension_1_getter_4th: {
		title: "It's far way to get here!",
		desc: "获取一个维度 1 的四阶夸克获取器。",
		check: () => player.quark.length > 1 && player.quark[1].length > 4 && player.quark[1][4][0] > 0
	},
	quark_dimension_2: {
		title: "第二维度！",
		desc: "获取一个拥有维度 2 的夸克。",
		check: () => player.quark.length > 2 && player.quark[2][0] > 0
	},
	quark_dimension_2_getter_4th: {
		title: "同样的方法，不同的时间！",
		desc: "获取一个维度 2 的四阶夸克获取器。",
		check: () => player.quark.length > 2 && player.quark[1].length > 4 && player.quark[2][4][0] > 0
	},
	quark_dimension_3: {
		title: "第三维度！",
		desc: "获取一个拥有维度 3 的夸克。",
		check: () => player.quark.length > 3 && player.quark[3][0] > 0
	},
	quark_dimension_4: {
		title: "第四维度！",
		desc: "获取一个拥有维度 4 的夸克。",
		check: () => player.quark.length > 4 && player.quark[4][0][0] > 0
	},
	the_end: {
		title: "结束了",
		desc: "获取一个拥有维度 10 的夸克。",
		check: () => player.quark.length > 10 && player.quark[10][0][0] > 0
	}
}, player = {};
function mainloop() {
	if (localStorage.game_quarks === undefined) {
		funcs.do_hard_reset();
	}
	else {
		player = JSON.parse(atob(localStorage.game_quarks));
	}
	setInterval(() => {
		while (flush.length > 0) {
			switch (flush[0]) {
				case 'all':
					flush.push('achievements');
					flush.push('quark');
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
						<button onclick='funcs.hard_reset()'>硬重置</button>
						<button onclick='funcs.get_quark_max_all()' id='quarkButtonMaxAll'>最大化所有夸克获取器</button>
					`;
					if (player.unlock_dimension) {
						str += "<p>";
						for (let i = 0; i < player.quark.length; i++) {
							str += `<button onclick="funcs.shown([${Array.from({length: player.quark.length}, (_, j) => ("quarkDimensionDiv" + j)).map(x => `'${x}'`).join(', ')}], 'quarkDimensionDiv${i}')">维度 ${i}</button>`;
						}
						str += "</p>";
					}
					for (let i = 0; i < player.quark.length; i++) {
						if (i && !player.unlock_dimension) {
							continue;
						}
						str += `
							<div id='quarkDimensionDiv${i}' class='${document.getElementById("quarkDimensionDiv" + i) === null && i == 0 || document.getElementById("quarkDimensionDiv" + i) !== null && document.getElementById("quarkDimensionDiv" + i).className === "shown" ? "shown" : "hidden"}'>
								<h2>你${player.unlock_dimension ? `在维度 ${i} ` : ""}有 ${funcs.TeXstr(player.quark[i][0])} 夸克。</h2>
								<p>
									${i == 0 ? "<button onclick='funcs.get_quark(" + i + ", 0)' id='quarkButton" + i + "-0'>获取一个</button>" : ""}
									<button onclick="funcs.get_quark_max_dimension(${i})" id="quarkButtonMaxDimension${i}">最大化这个维度的所有夸克获取器</button>
									${player.quark.length > 1 && player.quark[1][0] > 0 ? `
										<button
											onclick="funcs.convert_quark(${i})"
											id="convertQuarkButton${i}"
											${Math.floor(player.quark[i][0] / Math.pow(10, (i + 3) * 10)) < 1 ? "disabled" : ""}
										>
											清空这一维度并转换出下一维度 ${funcs.TeXstr(Math.floor(player.quark[i][0] / Math.pow(10, (i + 3) * 10)))} 夸克
										</button>
									` : (player.quark[0][0] >= 1e25 ? `
										<button
											onclick="funcs.convert_quark(${i})"
											id="convertQuarkButton${i}"
											${player.quark[0][0] >= 1e30 ? "" : "disabled"}
										>获取 1e30 夸克后解锁</button>
									` : "")}
								</p>
								${i != 0 ? `
									<p>你在这一层有 ${funcs.TeXstr(player.quark_points[i - 1])} 夸克点数。</p>
									<p class="about-quark-points">上一维度的夸克将会拥有 ${funcs.TeXstr(player.quark_points[i - 1] + 1 + player.quark[i][0])}x 的乘数。</p>
								` : ""}
								<table>
									<tr>
										<th>获取器</th>
										<th>拥有数量</th>
										<th>购买数量</th>
										<th>获取一个</th>
										<th>获取最大</th>
									</tr>
						`;
						for (let j = 1; j < player.quark[i].length; j++) {
							str += `
									<tr>
										<td>#${funcs.TeXstr(j)}</td>
										<td>${funcs.TeXstr(player.quark[i][j][0])}</td>
										<td>${funcs.TeXstr(player.quark[i][j][1])}</td>
										<td><button
											onclick="funcs.get_quark(${i}, ${j})"
											id="quarkButton${i}-${j}"
											${Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i) <= player.quark[i][0] ? "" : "disabled"}
										>
											花费 ${funcs.TeXstr(Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i))} 夸克获得一个
										</button></td>
										<td><button
											onclick="funcs.get_quark_max(${i}, ${j})"
											id="quarkButtonMax${i}-${j}"
											${Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i) <= player.quark[i][0] ? "" : "disabled"}
										>获取最大</button></td>
									</tr>
							`;
						}
						str += `
								</table>
							</div>
						`;
					}
					document.getElementById("main").innerHTML = str;
					break;
				}
				default:
					break;
			}
			flush.shift();
		}
	}, 50);
	setInterval(() => {
		for (let i = 0; i < player.quark.length; i++) {
			if (player.quark[i].length > 1 && player.quark[i][1][0] > 0) {
				while (player.quark_points.length < i + 2) {
					player.quark_points.push(0);
				}
				if (i == 0) {
					player.quark[i][0] += player.quark[i][1][0] * (player.quark_points[i] + 1 + player.quark[i + 1][0]);
				}
				else {
					player.quark_points[i - 1] += player.quark[i][1][0] * (player.quark_points[i] + 1 + player.quark[i + 1][0]);
				}
				for (let j = 1; j < player.quark[i].length - 1; j++) {
					player.quark[i][j][0] += player.quark[i][j + 1][0] * (player.quark_points[i] + 1 + player.quark[i + 1][0]);
				}
			}
		}
		flush.push('quark');
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
	}, 50);
	setTimeout(() => setInterval(() => localStorage.game_quarks = btoa(JSON.stringify(player)), 50), 1000);
};