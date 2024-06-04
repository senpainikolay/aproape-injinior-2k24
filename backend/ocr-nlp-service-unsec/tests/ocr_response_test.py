import time
from paddleocr import PaddleOCR

ocr = PaddleOCR(use_angle_cls=True, lang='en')

image_path = 'test.jpg'

def benchmark_ocr(image_path, ocr, runs=20):
    times = []
    for _ in range(runs):
        start_time = time.time()
        _ = ocr.ocr(image_path)
        end_time = time.time()
        times.append(end_time - start_time)
        print(f"Processing time for this run: {end_time - start_time:.4f} seconds")
    
    avg_time = sum(times) / runs
    print(f"\nAverage processing time over {runs} runs: {avg_time:.4f} seconds")

benchmark_ocr(image_path, ocr)
