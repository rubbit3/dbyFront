

$(function () {
    let scenes = {};
    let isAutoRotating = {};

    // 定义每个容器的缩放比例
    const scaleFactors = {
        'containerBaPanXia': 0.8,
        'containerZhuangLangHE': 0.9,
        'containerZhangYe': 2.0,
        'containerLinZe': 0.5,
        'containerQingShui': 0.95,
        'containerJiaYuGuan': 1.1,
        'containerShuLeHe': 0.75
    };

    function initScene(containerId, modelPath, rotateButtonId) {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth * 3 / 4, window.innerHeight / 2);
        // renderer.setClearColor(0x000000, 0);
        renderer.setClearColor(new THREE.Color(0xf0f0f0), 1); 
        // renderer.setClearColor(new THREE.Color(0xc8c9c6));
        document.getElementById(containerId).appendChild(renderer.domElement);

        let modelGroup = new THREE.Group();
        scene.add(modelGroup);

        // 添加环境光和点光源
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        let pointLight = new THREE.PointLight(0xffffff, 1);
        camera.add(pointLight);
        scene.add(camera);

        // 初始化旋转状态
        isAutoRotating[containerId] = false;

        // 添加旋转按钮的事件监听器（如果存在）
        if (rotateButtonId) {
            document.getElementById(rotateButtonId).addEventListener('click', function() {
                isAutoRotating[containerId] = !isAutoRotating[containerId];
            });
        }

        scenes[containerId] = { scene, camera, renderer, modelGroup };

        const loader = new THREE.GLTFLoader();
        loader.load(modelPath, function (gltf) {
            const model = gltf.scene;
            let scaleFactor = scaleFactors[containerId] || 1; // 获取缩放比例，默认为1
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            const box = new THREE.Box3().setFromObject(model);
            const modelCenter = box.getCenter(new THREE.Vector3());
            model.position.sub(modelCenter);
            modelGroup.add(model);
            animate(scene, camera, renderer, controls, modelGroup);
        }, undefined, function (error) {
            console.error('An error happened', error);
        });

        // 添加 OrbitControls
        let controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; 
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 500;

        scenes[containerId].controls = controls;

        // 添加鼠标移动事件监听器
        renderer.domElement.addEventListener('mousemove', (event) => onMouseMove(event, containerId), false);

        animate(containerId);
    }

    function animate(containerId) {
        requestAnimationFrame(() => animate(containerId));

        if (isAutoRotating[containerId]) {
            scenes[containerId].modelGroup.rotation.y += 0.01; // 调整旋转速度
        }

        scenes[containerId].renderer.render(scenes[containerId].scene, scenes[containerId].camera);
    }

    // 初始化每个场景
    initScene('containerBaPanXia', 'dist/images/Model/八盘峡黄河特大桥.glb', 'rotate-button-containerBaPanXia');
    initScene('containerZhuangLangHE', 'dist/images/Model/庄浪河8桥.glb', 'rotate-button-ZhuangLangHE');
    initScene('containerZhangYe', 'dist/images/Model/张掖南跨G045特大桥.glb', "rotate-button-ZhangYe");
    initScene('containerLinZe', 'dist/images/Model/临泽南特.glb', "rotate-button-LinZe");
    initScene('containerQingShui', 'dist/images/Model/酒泉南站-清水北站大桥.glb', 'rotate-button-QingShui');
    initScene('containerJiaYuGuan', 'dist/images/Model/酒泉南站-嘉峪关南站大桥.glb', 'rotate-button-JiaYuGuan');
    initScene('containerShuLeHe', 'dist/images/Model/疏勒河特大桥.glb', "rotate-button-ShuLeHe");

    // 初始化局部模型场景，不需要自动旋转
    initScene('containerJiaYuGuan_JuBU', 'dist/images/Model/酒泉南站-嘉峪关南站大桥-局部.glb', null);
    initScene('containerQingShui_JuBU', 'dist/images/Model/酒泉南站-清水北站大桥-局部.glb', null);
    initScene('containerLinZe_JuBu', 'dist/images/Model/临泽南特-局部.glb', null);
    initScene('containerShuLeHe_JuBU', 'dist/images/Model/疏勒河特大桥-局部.glb', null);

    platformname();
});


var url = window.location.href;
var obj = {};
str = url.split("?")[1].split("&");
for (let i = 0; i < str.length; i++) {
    let a = str[i].split('=');
    obj[a[0]] = a[1];
}
var token = $.cookie('token');
var building = obj.building;
var type = obj.type
var username = obj.name;

function onWindowResize(containerId, camera, renderer) {
    const container = document.getElementById(containerId);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

//获取平台名称
function platformname() {
    var platname = "";
    $.ajax({
        type: "GET",
        url: wz[19],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: '',
        jsonp: 'callback',
        success: function (msg) {
            console.log(msg.name)
            platname = msg.name;
            document.getElementById("platername").innerHTML = platname;
            document.getElementById("adeditpname").value = platname;
        },
        error: function () {
            alert("错误");
        }
    });
}