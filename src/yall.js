((window, document) => {
	const lazyLoader = {
		lazyClass: "lazy",
		images: null,
		processing: false,
		throttle: 200,
		buffer: 50,
		init: () => {
			lazyLoader.images = [].slice.call(document.getElementsByClassName(lazyLoader.lazyClass));
			lazyLoader.scanImages();
			document.addEventListener("scroll", lazyLoader.scanImages);
			document.addEventListener("touchmove", lazyLoader.scanImages);
			window.addEventListener("orientationchange", lazyLoader.scanImages);
			window.addEventListener("resize", lazyLoader.scanImages);
		},
		destroy: () => {
			document.removeEventListener("scroll", lazyLoader.scanImages);
			document.removeEventListener("touchmove", lazyLoader.scanImages);
			window.removeEventListener("orientationchange", lazyLoader.scanImages);
			window.removeEventListener("resize", lazyLoader.scanImages);
		},
		scanImages: () => {
			if(document.getElementsByClassName(lazyLoader.lazyClass).length === 0){
				lazyLoader.destroy();
				return;
			}

			if(lazyLoader.processing === false){
				lazyLoader.processing = true;

				setTimeout(() => {
					for(let i in lazyLoader.images){
						if(lazyLoader.images[i].className.indexOf("lazy") !== -1){
							if(lazyLoader.inViewport(lazyLoader.images[i])){
								lazyLoader.loadImage(lazyLoader.images[i]);
							}
						}
					}

					lazyLoader.processing = false;
				}, lazyLoader.throttle);
			}
		},
		inViewport: (img) =>{
			let top = ((document.body.scrollTop || document.documentElement.scrollTop) + window.innerHeight) + lazyLoader.buffer,
				isVisible = img.currentStyle ? img.currentStyle.display : getComputedStyle(img, null).display;
			return img.offsetTop <= top && isVisible !== "none";
		},
		loadImage: (img) => {
			if(img.parentNode.tagName === "PICTURE"){
				let sourceEl = img.parentNode.getElementsByTagName("source");

				for(let i = 0; i < sourceEl.length; i++){
					let sourceSrcset = sourceEl[i].getAttribute("data-srcset");

					if(sourceSrcset !== null){
						sourceEl[i].setAttribute("srcset", sourceSrcset);
						sourceEl[i].removeAttribute("data-srcset");
					}
				}
			}

			let imgSrc = img.getAttribute("data-src"),
				imgSrcset = img.getAttribute("data-srcset");

			if(imgSrc !== null){
				img.setAttribute("src", imgSrc);
				img.removeAttribute("data-src");
			}

			if(imgSrcset !== null){
				img.setAttribute("srcset", imgSrcset);
				img.removeAttribute("data-srcset");
			}

			img.classList.remove(lazyLoader.lazyClass);
			img.removeAttribute("style");
		}
	};

	document.onreadystatechange = lazyLoader.init;
})(window, document);