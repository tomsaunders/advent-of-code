#!/usr/bin/env php
<?php
ini_set('memory_limit','4G');
gc_disable();
$in   = 4172;
$test = 0;

class grid {
	public $serial = 0;	
	public $arr = [];
	public $size = 0;

	public function __construct($serial, $size){
		$this->serial = $serial;
		$this->size = $size;
		for ($y = 1; $y <= $size; $y++){
			for ($x = 1; $x <= $size; $x++){
				$this->addCell($x, $y);
			}
		}
	}

	public function calc(){
		$max = 0;
		$m = '';
		$size = $this->size;

		for ($y = 1; $y <= ($size-2); $y++){
			for ($x = 1; $x <= ($size-2); $x++){
				$block = "$x,$y";
				$blockP = 0;
				for ($b = $y; $b < $y + 3; $b++){
					for ($a = $x; $a < $x + 3; $a++){
						$cell = $this->getCell($a, $b);
						$blockP += $cell->power;
					}
				}
				if ($blockP > $max){
					$max = $blockP;
					$m = $block;
				}
			}
		}
		echo "Max $max at $m\n";
	}

	public function calcX(){
		$max = 0;
		$m = '';
		$size = $this->size;

		for ($y = 1; $y <= $size; $y++){
			for ($x = 1; $x <= $size; $x++){
				$z = max($y, $x);
				$maxS = max($size - $z, 20);
				$blockP = 0;
				for ($s = 1; $s < $maxS; $s++){
					$block = "$x,$y,$s";
					for ($b = $y; $b < $y + $s; $b++){
						for ($a = $x; $a < $x + $s; $a++){
							$cell = $this->getCell($a, $b);
							$blockP += $cell->power;
						}
					}
					if ($blockP > $max){
						$max = $blockP;
						$m = $block;
						echo "Max now $max at $m\n";
					}
				}
			}
		}
		echo "Max final $max at $m\n";
	}

	public function getCell($x, $y){
		$key = "{$x},{$y}";
		return $this->arr[$key];
	}

	private function addCell($x, $y){
		$cell = new cell($x, $y, $this->serial);
		$key = "{$x},{$y}";
		$this->arr[$key] = $cell;
	}

}

class cell {
	public $power = 0;
	private $x = 0;
	private $y = 0;

	public function __construct($x, $y, $gridSerial){
		$this->x = $x;
		$this->y = $y;

		$rack = $this->x + 10;
		$power = $rack * $this->y;
		$power += $gridSerial;
		$power *= $rack;
		$power = $power;
		$power = strrev($power) . '000';
		$power = (int)$power[2];
		$power -= 5;
		$this->power = $power;
	}
}

// $t1 = new cell(122,79, 57);
// $t2 = new cell(217,196, 39);
// $t3 = new cell(101, 153, 71);
echo "Part 1\n\n";

$g1 = new grid(18, 300);
$g2 = new grid(42, 300);

$g1->calc();
$g2->calc();

$g = new grid($in, 300);
$g->calc();

echo "\nPart 2\n";
$g1->calcX();
$g2->calcX();
$g->calcX();

echo "\n";