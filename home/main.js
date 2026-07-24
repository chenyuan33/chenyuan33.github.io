Promise.all([
	new Promise(resolve => document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', resolve) : resolve()),
	i18nValue('langName').then(lang => fetch(`/blog/${lang}/data.json`)).then(res => res.json())
]).then(async ([_, data]) => {
	const blogList = document.getElementById('blogList');
	for (const [id, {title}] of Object.entries(data.blog).slice(0, 5)) {
		blogList.insertAdjacentHTML('beforeend', `
			<li><a href="/blog/show/index.html?id=${id}">${await inlineMdToHtml(title)}</a></li>
		`);
	}
});