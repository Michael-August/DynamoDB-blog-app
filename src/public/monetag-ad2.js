(function (d, z, s, c) {
	s.src = "//" + d + "/400/" + z;
	s.onerror = s.onload = E;
	function E() {
		c && c();
		c = null;
	}
	try {
		(document.body || document.documentElement).appendChild(s);
	} catch (e) {
		E();
	}
})("saptorge.com", 8701222, document.createElement("script"), _losgco);
