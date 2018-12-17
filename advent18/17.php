#!/usr/bin/env php
<?php
$in = file_get_contents('input17.txt');
$spring = [500,0];
$test = <<<TST
x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504
TST;
$in = $test;
$lines = explode("\n", $in);

global $minX;
$minX = 9999;
$maxX = 0;
$minY = 9999;
$maxY = 0;
foreach ($lines as $line){
	$bits = explode(', ', $line);
	list($fixed, $range) = $bits;
	list($fvar, $fval) = explode('=', $fixed);
	list($rvar, $valrange) = explode('=', $range);
	list($from, $to) = explode("..", $valrange);
	// echo "$line -- $fixed $range / $fvar $fval / $rvar $from - $to\n"; exit;
	if ($fvar === 'y'){
		$minY = min($minY, $fval);
		$maxY = max($maxY, $fval);
	} else {
		$minX = min($minX, $fval);
		$maxX = max($maxX, $fval);
	}
	if ($rvar === 'y'){
		$minY = min($minY, $from);
		$maxY = max($maxY, $to);
	} else {
		$minX = min($minX, $from);
		$maxX = max($maxX, $to);
	}
}

////
define('CLAY', '#');
define('OPEN', '.');
define('WATER', '~');
global $grid;
$grid = array_pad([], $maxY + 5, str_pad('', $maxX + 5, OPEN));

foreach ($lines as $line){
	$bits = explode(', ', $line);
	list($fixed, $range) = $bits;
	list($fvar, $fval) = explode('=', $fixed);
	list($rvar, $valrange) = explode('=', $range);
	list($from, $to) = explode("..", $valrange);
	// echo "$line -- $fixed $range / $fvar $fval / $rvar $from - $to\n"; exit;
	if ($fvar === 'y'){
		$y = $fval;
		for ($x = $from; $x <= $to; $x++){
			$grid[$y][$x] = CLAY;
		}

	} else {
		$x = $fval;
		for ($y = $from; $y <= $to; $y++){
			$grid[$y][$x] = CLAY;
		}
	}
}

function p($grid, $water = NULL) {
	global $minX;
	$w = $grid;
	if ($water){
		list($wy, $wx) = [$water->y, $water->x];
		$w[$wy][$wx] = WATER;
	}
	foreach ($w as $row){
		echo substr($row, $minX) . "\n";
	}
}

p($grid);

class water {
	public $x;
	public $y;
	public $grid;
	public $leftWall = FALSE;
	public $rightWall = FALSE;
	public function __construct($spring){
		list($this->x, $this->y) = $spring;
		
		global $grid;
		$this->grid = $grid;
	}
	public function down(){
		$this->y++;
		$this->leftWall = TRUE;
		$this->rightWall = TRUE;
	}
	public function left(){
		$this->x--;
	}
	public function right(){
		$this->x++;
	}

	public function move(){
		global $grid;
		$this->grid = $grid;

		$down = [1,0];
		while ($this->canMove($down)){
			$this->y++;
			$this->leftWall = $this->rightWall = FALSE;
			// p($this->grid,$this);
		} 
		$right = [0, 1];
		if (!$this->rightWall && $this->canMove($right)){
			$this->x++;
			// p($this->grid,$this);
			return TRUE;
		} else {
			$this->rightWall = TRUE;
		}
		$left = [0,-1];
		if ($this->canMove($left)){
			$this->x--;
			// p($this->grid,$this);
			return TRUE;
		} else {
			$this->leftWall = TRUE;
			$grid[$this->y][$this->x] = WATER;
			// echo "Fixed at {$this->x},{$this->y}\n";
			// p($this->grid,$this);
			// exit;
		}
	}

	public function canMove($dir){
		list($dy, $dx) = $dir;
		$y = $this->y + $dy;
		$x = $this->x + $dx;
		if (isset($this->grid[$y]) && $this->grid[$y][$x] === OPEN){
			return TRUE;
		}
		return FALSE;
	}
}

$fellThrough = FALSE;
$done = 0;
while (!$fellThrough){
	$w = new water($spring);
	while ($w->move()){
		
	}
	$done++;
	p($grid);
	if ($w->y > $maxY){
		$fellThrough = TRUE;
	}
}

echo "Done $done\n";