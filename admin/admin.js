const axios = require('axios');

async function pushFileToGitHub(token, repoOwner, repoName, filePath, fileContent, commitMessage) {
	const fileData = {
		message: commitMessage,
		content: Buffer.from(fileContent).toString('base64'), // 文件内容需要base64编码
	};
	try {
		const response = await axios.put(
			`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
			fileData,
			{
				headers: {
					Authorization: `token ${token}`,
				},
			}
		);
		console.log('文件已成功推送:', response.data.commit.sha);
	} catch (error) {
		console.error('推送文件出错:', error.response ? error.response.data : error.message);
	}
}