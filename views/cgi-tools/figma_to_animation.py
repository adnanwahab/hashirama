



def bun_to_python():

    output = replicate.run(
        "rossjillian/controlnet:795433b19458d0f4fa172a7ccf93178d2adb1cb8ab2ad6c8fdc33fdbcd49f477",
        input={
            "eta": 0,
            "seed": 20,
            "image": "https://replicate.delivery/pbxt/IYQLHLFDraqCrjDUoiwpM9xBhQM1eQVHbxBiNxcbwctUamzb/user_1.png",
            "scale": 9,
            "steps": 20,
            "prompt": "a photo of a brightly colored turtle",
            "scheduler": "DDIM",
            "structure": "scribble",
            "num_outputs": 1,
            "low_threshold": 100,
            "high_threshold": 200,
            "negative_prompt": "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            "image_resolution": 512,
            "return_reference_image": False
        }
    )
    print(output)


bun_to_python()