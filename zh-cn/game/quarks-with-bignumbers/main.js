var flush = ['all'], paused = false, get_current_archive = () => {
	document.getElementById('archive').value = btoa(JSON.stringify(player));
}, set_current_archive = () => {
	let errmsg = "存档内容有误。", temp = {};
	try {
		temp = JSON.parse(atob(document.getElementById("archive").value));
	} catch (e) {
		alert(errmsg);
		return;
	}
	player = temp;
	flush.push('all');
}, shown = (hiddens, shown) => {
	hiddens.forEach(element => {
		document.getElementById(element).className = "hidden";
	});
	document.getElementById(shown).className = "shown";
}, TeXstr = num => {
	let ret = "";
	if (num.s == -1) {
		ret += "-";
		num = num.times(new BigNumber(-1));
	}
	if (num.lt(new BigNumber(1000))) {
		ret += num.toString();
	} else {
		ret += num.div(new BigNumber(10).pow(new BigNumber(num.e))).precision(3).toString() + "e" + TeXstr(new BigNumber(num.e));
	}
	return ret;
}, do_hard_reset = () => {
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
		quark: [[new BigNumber(0)]],
		quark_points: [new BigNumber(0)],
		unlock_dimension: false
	};
	flush.push('all');
}, hard_reset = () => {
	if (confirm("你确定要重置你的进度吗？这将会导致丢失所有游戏数据和成就。如果你想要备份存档，请先点击“取消”，然后在读档/存档界面获取并保存。")) {
		do_hard_reset();
	}
}, get_quark = (dimension, level) => {
	let ret = false;
	if (!level) {
		if (dimension) {
			return false;
		}
		player.quark[0][0] = player.quark[0][0].plus(new BigNumber(1));
		flush.push('quark');
		ret = true;
	}
	if (player.quark[dimension][0].gte((new BigNumber(2)).pow(player.quark[dimension][level][1]).times((new BigNumber(10)).pow(new BigNumber(level))).times((new BigNumber(20)).pow(new BigNumber(dimension))))) {
		player.quark[dimension][0] = player.quark[dimension][0].minus((new BigNumber(2)).pow(player.quark[dimension][level][1]).times((new BigNumber(10)).pow(new BigNumber(level))).times((new BigNumber(20)).pow(new BigNumber(dimension))));
		player.quark[dimension][level][0] = player.quark[dimension][level][0].plus(1);
		player.quark[dimension][level][1] = player.quark[dimension][level][1].plus(1);
		flush.push('quark');
		ret = true;
	}
	if (ret) {
		if (dimension == player.quark.length - 1 && dimension < 1e5) {
			player.quark.push([new BigNumber(0)]);
			player.quark_points.push(new BigNumber(0));
		}
		if (level == player.quark[dimension].length - 1 && level < 1e5) {
			player.quark[dimension].push([new BigNumber(0), new BigNumber(0)]);
		}
	}
	return false;
}, get_quark_max = (dimension, level) => {
	let ret = false;
	if (level) {
		while (get_quark(dimension, level)) {
			ret = true;
		}
	}
	return ret;
}, get_quark_max_dimension = dimension => {
	let ret = false;
	for (let i = 1; i < player.quark[dimension].length; i++) {
		if (get_quark_max(dimension, i)) {
			ret = true;
		}
	}
	return ret;
}, get_quark_max_all = () => {
	let ret = false;
	for (let i = 0; i < player.quark.length; i++) {
		if (get_quark_max_dimension(i)) {
			ret = true;
		}
	}
	return ret;
}, convert_quark = dimension => {
	if (dimension == player.quark.length - 1 && dimension < 1e5) {
		player.quark.push([new BigNumber(0)]);
		player.quark_points.push(new BigNumber(0));
	}
	if (player.quark[dimension + 1].length == 1) {
		player.quark[dimension + 1].push([new BigNumber(0), new BigNumber(0)]);
	}
	player.quark[dimension + 1][0] = player.quark[dimension + 1][0].plus(player.quark[dimension][0].idiv((new BigNumber(10)).pow(((new BigNumber(dimension)).plus(new BigNumber(3))).times(new BigNumber(10)))));
	player.quark[dimension] = [new BigNumber(0)];
	player.unlock_dimension = true;
	flush.push('quark');
}, pause = () => {
	paused = !paused;
	flush.push('all');
}, achievements = undefined, player = {}, mainloop = () => {
	document.getElementById("hadAchievements").style.display = "none";
	achievements = {
		first_quark: {
			title: "夸克",
			desc: "获得一个夸克。",
			check: () => player.quark[0][0].gt(new BigNumber(0))
		},
		quark_getter: {
			title: "速度",
			desc: "获取一个夸克获取器。",
			check: () => player.quark[0].length > 1 && player.quark[0][1][0].gt(new BigNumber(0))
		},
		quark_getter_2nd: {
			title: "加速度",
			desc: "用获取器获取获取器！（获取一个夸克获取器 #2）",
			check: () => player.quark[0].length > 2 && player.quark[0][2][0].gt(new BigNumber(0))
		},
		quark_getter_3rd: {
			title: "指数增长",
			desc: "用获取器获取的获取器获取获取器！（获取一个夸克获取器 #3）",
			check: () => player.quark[0].length > 3 && player.quark[0][3][0].gt(new BigNumber(0))
		},
		quark_getter_4th: {
			title: "无限循环",
			desc: "用获取器获取的获取器获取可以获取获取器的获取器！（获取一个夸克获取器 #4）",
			check: () => player.quark[0].length > 4 && player.quark[0][4][0].gt(new BigNumber(0))
		},
		quark_1e10: {
			title: "一个小目标",
			desc: `获得 1e10 夸克。`,
			check: () => player.quark[0][0].gt(new BigNumber(1e10))
		},
		quark_1e15: {
			title: "好多夸克",
			desc: `获得 1e15 夸克。`,
			check: () => player.quark[0][0].gt(new BigNumber(1e15))
		},
		quark_1e20: {
			title: "更多夸克",
			desc: `获得 1e20 夸克。`,
			check: () => player.quark[0][0].gt(new BigNumber(1e20))
		},
		quark_1e25: {
			title: "超多夸克",
			desc: `获得 1e25 夸克。`,
			check: () => player.quark[0][0].gt(new BigNumber(1e25))
		},
		quark_dimension_1: {
			title: "新大陆",
			desc: "获得一个拥有维度 1 的夸克。",
			check: () => player.quark.length > 1 && player.quark[1][0].gt(new BigNumber(0))
		},
		quark_dimension_1_getted_2: {
			title: "再一次",
			desc: "拥有两个维度 1 的夸克。",
			check: () => player.quark.length > 1 && player.quark[1][0].gt(new BigNumber(1))
		},
		quark_dimension_1_getter: {
			title: "来自另一维度的速度提升方式",
			desc: "获取器加强获取器！（获得一个维度 1 的夸克获取器）",
			check: () => player.quark.length > 1 && player.quark[1].length > 1 && player.quark[1][1][0].gt(new BigNumber(0))
		},
		quark_dimension_1_getter_2nd: {
			title: "提升速度的加速度",
			desc: "用获取器获取的获取器加强获取器！（获得一个维度 1 的二阶夸克获取器）",
			check: () => player.quark.length > 1 && player.quark[1].length > 2 && player.quark[1][2][0].gt(new BigNumber(0))
		},
		quark_dimension_1_getter_3rd: {
			title: "指数增长的指数增长速度",
			desc: `用获取器获取的获取器获取可以加强获取器的获取器！（获取一个维度 1 的三阶夸克获取器）`,
			check: () => player.quark.length > 1 && player.quark[1].length > 3 && player.quark[1][3][0].gt(new BigNumber(0))
		},
		quark_dimension_1_getter_4th: {
			title: "循环还在继续",
			desc: "用获取器获取的获取器获取可以获取用以加强获取器的获取器的获取器！（获取一个维度 1 的四阶夸克获取器）",
			check: () => player.quark.length > 1 && player.quark[1].length > 4 && player.quark[1][4][0].gt(new BigNumber(0))
		},
		quark_dimension_2: {
			title: "禁止套娃",
			desc: "获取一个拥有维度 2 的夸克。",
			check: () => player.quark.length > 2 && player.quark[2][0].gt(new BigNumber(0))
		},
		quark_dimension_2_getter_4th: {
			title: "实在不知道起啥名了啊啊啊",
			desc: "获取一个维度 2 的四阶夸克获取器。",
			check: () => player.quark.length > 2 && player.quark[2].length > 4 && player.quark[2][4][0].gt(new BigNumber(0))
		},
		quark_dimension_3: {
			title: "层层递进",
			desc: "获取一个拥有维度 3 的夸克。",
			check: () => player.quark.length > 3 && player.quark[3][0].gt(new BigNumber(0))
		},
		quark_dimension_4: {
			title: "进化",
			desc: "获取一个拥有维度 4 的夸克。",
			check: () => player.quark.length > 4 && player.quark[4][0].gt(new BigNumber(0))
		},
		the_end: {
			title: "达成结局",
			desc: "获取一个拥有维度 10 的夸克。",
			check: () => player.quark.length > 10 && player.quark[10][0].gt(new BigNumber(0))
		}
	};
	if (localStorage.game_quarks_snapshot === undefined) {
		do_hard_reset();
	}
	else {
		player = JSON.parse(atob(localStorage.game_quarks_snapshot));
		for (let i = 0; i < player.quark.length; i++) {
			player.quark[i][0] = new BigNumber(player.quark[i][0]);
			for (let j = 1; j < player.quark[i].length; j++) {
				player.quark[i][j][0] = new BigNumber(player.quark[i][j][0]);
				player.quark[i][j][1] = new BigNumber(player.quark[i][j][1]);
			}
		}
		for (let i = 0; i < player.quark_points.length; i++) {
			player.quark_points[i] = new BigNumber(player.quark_points[i]);
		}
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
						<div id="achievement-container">
					`;
					for (let key in achievements) {
						str += `
							<p class="achievement-${player.achievements[key] ? "" : "un"}getted">
								${achievements[key].title}
								<br />
								<span class="achievement-desc">${achievements[key].desc}</span>
							</p>
						`;
					}
					document.getElementById("achievements").innerHTML = str + `
						</div>
					`;
					break;
				}
				case 'quark': {
					let str = `
						<button onclick='hard_reset()'>硬重置</button>
						<button onclick='pause()'>${paused ? "继续" : "暂停"}</button>
						<button onclick='get_quark_max_all()' id='quarkButtonMaxAll' ${paused ? "disabled" : ""}>最大化所有夸克获取器</button>
					`;
					if (paused) {
						str += `<p>您已暂停游戏。点击上面的“继续”按钮结束暂停。</p>`;
					}
					if (player.unlock_dimension) {
						str += "<p>";
						for (let i = 0; i < player.quark.length; i++) {
							str += `<button onclick="shown([${Array.from({ length: player.quark.length }, (_, j) => ("quarkDimensionDiv" + j)).map(x => `'${x}'`).join(', ')}], 'quarkDimensionDiv${i}')">维度 ${i}</button>`;
						}
						str += "</p>";
					}
					for (let i = 0; i < player.quark.length; i++) {
						if (i && !player.unlock_dimension) {
							continue;
						}
						str += `
							<div id='quarkDimensionDiv${i}' class='${document.getElementById("quarkDimensionDiv" + i) === null && i == 0 || document.getElementById("quarkDimensionDiv" + i) !== null && document.getElementById("quarkDimensionDiv" + i).className === "shown" ? "shown" : "hidden"}'>
								<h2>你${player.unlock_dimension ? `在维度 ${i} ` : ""}有 ${TeXstr(player.quark[i][0])} 夸克。</h2>
								<p>
									${i == 0 ? "<button onclick='get_quark(" + i + ", 0)' id='quarkButton" + i + "-0'>获取一个</button>" : ""}
									<button onclick="get_quark_max_dimension(${i})" id="quarkButtonMaxDimension${i}">最大化这个维度的所有夸克获取器</button>
									${player.unlock_dimension ? `
										<button
											onclick="convert_quark(${i})"
											id="convertQuarkButton${i}"
											${player.quark[i][0].idiv((new BigNumber(10)).pow(((new BigNumber(i)).plus(3)).times(10))) < 1 ? "disabled" : ""}
										>
											清空这一维度并转换出下一维度 ${TeXstr(player.quark[i][0].idiv((new BigNumber(10)).pow(((new BigNumber(i)).plus(3)).times(10))))} 夸克
										</button>
									` : (player.quark[0][0].gte(new BigNumber(1e25)) ? `
										<button
											onclick="convert_quark(${i})"
											id="convertQuarkButton${i}"
											${player.quark[0][0].lt(new BigNumber(1e30)) ? "disabled" : ""}
										>达到 1e30 夸克后解锁</button>
									` : "")}
								</p>
								${i != 0 ? `
									<p>你在这一层有 ${TeXstr(player.quark_points[i - 1])} 夸克点数。</p>
									<p class="about-quark-points">上一维度的夸克将会拥有 ${TeXstr(player.quark_points[i - 1].plus(new BigNumber(1)).plus(player.quark[i][0]))}x 的乘数。</p>
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
							if ((new BigNumber(2)).pow(player.quark[i][j][1]).times((new BigNumber(10)).pow(j)).times((new BigNumber(20)).pow(i)).gt(player.quark[i][0])) {
								str += `
									<tr>
										<td>#${TeXstr(new BigNumber(j))}</td>
										<td>${TeXstr(player.quark[i][j][0])}</td>
										<td>${TeXstr(player.quark[i][j][1])}</td>
										<td id="quarkButton${i}-${j}" class="disabledButtonInTable">
											花费 ${TeXstr((new BigNumber(2)).pow(player.quark[i][j][1]).times((new BigNumber(10)).pow(j)).times((new BigNumber(20)).pow(i)))} 夸克获得一个
										</td>
										<td id="quarkButtonMax${i}-${j}" class="disabledButtonInTable">获取最大</td>
									</tr>
								`;
							} else {
								str += `
									<tr>
										<td>#${TeXstr(new BigNumber(j))}</td>
										<td>${TeXstr(player.quark[i][j][0])}</td>
										<td>${TeXstr(player.quark[i][j][1])}</td>
										<td onclick="get_quark(${i}, ${j})" id="quarkButton${i}-${j}" class="buttonInTable">
											花费 ${TeXstr((new BigNumber(2)).pow(player.quark[i][j][1]).times((new BigNumber(10)).pow(j)).times((new BigNumber(20)).pow(i)))} 夸克获得一个
										</td>
										<td onclick="get_quark_max(${i}, ${j})" id="quarkButtonMax${i}-${j}" class="buttonInTable">获取最大</td>
									</tr>
								`;
							}
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
		if (paused) {
			return;
		}
		for (let i = 0; i < player.quark.length; i++) {
			if (player.quark[i].length > 1 && player.quark[i][1][0].gt(new BigNumber(0))) {
				while (player.quark_points.length < i + 2) {
					player.quark_points.push(new BigNumber(0));
				}
				let factor = player.quark_points[i].plus(new BigNumber(1));
				if (i + 1 < player.quark.length) {
					factor = factor.plus(player.quark[i + 1][0]);
				}
				if (i == 0) {
					player.quark[i][0] = player.quark[i][0].plus(player.quark[i][1][0].times(factor));
				}
				else {
					player.quark_points[i - 1] = player.quark_points[i - 1].plus(player.quark[i][1][0].times(factor));
				}
				for (let j = 1; j < player.quark[i].length - 1; j++) {
					player.quark[i][j][0] = player.quark[i][j][0].plus(player.quark[i][j + 1][0].times(factor));
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
	setTimeout(() => setInterval(() => localStorage.game_quarks_snapshot = btoa(JSON.stringify(player)), 50), 1000);
};