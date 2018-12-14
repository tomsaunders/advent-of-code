#!/usr/bin/env php
<?php

ini_set('memory_limit','4G');
gc_disable();
$in   = 652601;

class scoreboard {
	public $arr;
	public $elves = [];
	public function __construct(){
		$this->arr = '37';
		$this->elves = [
			new elf(0, $this),
			new elf(1, $this)
		];
	}

	public function turn(){
		$sum = 0;
		foreach($this->elves as $elf){
			$sum += $elf->score();
		}
		// $bits = str_split(''.$sum, 1);
		// $this->arr = array_merge($this->arr, $bits);
		$this->arr .= $sum;
		// echo "Turn! score $sum\n";
		// echo implode(' ', $this->arr) . "\n";
		foreach ($this->elves as $elf){
			$elf->move();
		}
		return $bits;
	}

	public function recipes($count){
		while (strlen($this->arr) < $count){
			$this->turn();
		}
	}

	public function next10($count){
		$ten = [];
		while (strlen($this->arr) < ($count + 10)){
			$this->turn();
			if (count($this->arr) % 1000 == 0){
				echo count($this->arr) . "\n";
			}
		}
		// while (count($ten) < 10){
		// 	$bits = $this->turn();
		// 	$ten = array_merge($ten, $bits);
		// }
		return substr($this->arr, $count, 10);
	}

	public function find($find) {
		$len = strlen($this->arr);
		$last = substr($this->arr, -12);
		
		while (strpos($last, $find) === FALSE){
			$this->turn();
			$len = strlen($this->arr);
			if ($len % 10000 == 0){
				echo $len . "\n";
			}
			$last = substr($this->arr, -12);
		}
		return strpos($this->arr, $find);
	}
}
class elf {
	public $pos = 0;
	public function __construct($pos, $scoreboard){
		$this->pos = $pos;
		$this->scoreboard = $scoreboard;
	}

	public function score() {
		return $this->scoreboard->arr[$this->pos];
	}

	public function move() {
		$current = $this->score();
		$len = strlen($this->scoreboard->arr);
		$next = (1 + $current + $this->pos) % $len;
		// echo "Next pos 1 + $current + {$this->pos} % $len = $next\n";
		$this->pos = $next;
	}
}

$tests = [
	[9,'5158916779'],
	[5,'0124515891'],
	[18,'9251071085'],
	[2018,'5941429882'],
	// [$in, '']
];
foreach ($tests as $test){
	list($turns, $expect) = $test;
	$sb = new scoreboard();
	// $sb->recipes($turns);
	$ten = $sb->next10($turns);
	$match = ($expect == $ten) ? 'does match' : 'does not match';
	echo "After $turns, we get $ten which {$match} $expect\n";
}

echo "\nPart 2\n";
$twos = [
	['51589', 9],
	['01245', 5],
	['92510', 18],
	['59414', 2018],
	[''.$in, 0]
];
foreach ($twos as $test){
	list($find, $expect) = $test;
	$sb = new scoreboard();
	$time = $sb->find($find);
	$match = ($expect == $time) ? 'does match' : 'does not match';
	echo "To find $find, we took $time which {$match} $expect\n";
}