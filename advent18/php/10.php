#!/usr/bin/env php
<?php
ini_set('memory_limit','4G');
gc_disable();
$in   = file_get_contents('input10.txt');
$test = <<<TST
position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>
TST;
// $in = $test;
$lines = explode("\n", $in);
class light {
	public $x = 0;
	public $y = 0;
	public $dx = 0;
	public $dy = 0;

	public function __construct($line){
		$line = str_replace(['position=', '<', '>', 'velocity=', ','], '', $line);
		$line = str_replace('  ', ' ', $line);
		list($this->x, $this->y, $this->dx, $this->dy) = array_map('trim', explode(' ', trim($line)));
	}

	public function move() {
		$this->x += $this->dx;
		$this->y += $this->dy;
	}
}

class node {
	public $v;
	public $nextNode;
	public $prevNode;

	public function __construct($value) {
		$this->v = $value;
	}

	public function prev() {
		return $this->prevNode;
	}

	public function add($value) {
		$node = new node($value);
		$tmp  = $this->nextNode;

		$tmp->prevNode  = $node;
		$node->prevNode = $this;
		$node->nextNode = $tmp;
		$this->nextNode = $node;
		return $node;
	}

	public function remove() {
		$this->nextNode->prevNode = $this->prevNode;
		$this->prevNode->nextNode = $this->nextNode;
		$tmp = $this->nextNode;

		$this->prevNode = $this->nextNode = null;
		return $tmp;
	}

	public function circle() {
		$out = $this->v;
		$t   = $this->next();
		while ($t !== $this) {
			$out .= "," . $t->v;
			$t   = $t->next();
		}
		return $out;
	}

	public function next() {
		return $this->nextNode;
	}
}

function printLights($lights, $maxx, $minx, $maxy, $miny){
	$yrange = $maxy - $miny;
	$xrange = $maxx - $minx;
	$yoff = $miny < 0 ? abs($miny) : -$miny;
	$xoff = $minx < 0 ? abs($minx) : -$minx;

	$out = array_pad([], $yrange + 1, str_pad('', $xrange + 1, '.'));
	foreach ($lights as $light){
		$y = $light->y + $yoff;
		$x = $light->x + $xoff;
		$out[$y][$x] = '#';
	}

	return implode("\n", $out);
}


$max = 999999;
$lights = [];
foreach ($lines as $line){
	$lights[] = new light($line);
}


$diff = 99999999;
$i = 0;
while (++$i < $max){
	$maxx = $maxy = 0;
	$minx = $miny = 999999;
	foreach ($lights as $light){
		$light->move();
		$maxx = max($maxx, $light->x);
		$maxy = max($maxy, $light->y);
		$minx = min($minx, $light->x);
		$miny = min($miny, $light->y);
	}
	$d = $maxx - $minx + $maxy - $miny;
	if ($d < $diff){
		echo "After $i, biggest diff is now $d\n\n";
		$diff = $d;
	} else {
		echo "\n\n=== After $i, diff just increased to $d\n";
		$i = $max + 1;
	
	}
	if ($d < 200){
		echo printLights($lights, $maxx, $minx, $maxy, $miny);
	}
}


$one = $two = '';

echo "Part 1 $one\n\n";

echo "Part 2 $two\n";
echo "\n";