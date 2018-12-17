#!/usr/bin/env php
<?php

define('WALL', '#');
define('OPEN', '.');
define('GOBLIN', 'G');
define('ELF', 'E');

ini_set('memory_limit', '4G');
gc_disable();
$in     = file_get_contents('input15.txt');
$test   = <<<TST
#########
#G..G..G#
#.......#
#.......#
#G..E..G#
#.......#
#.......#
#G..G..G#
#########
TST;
$test2  = <<<TST
#######
#E..G.#
#...#.#
#.G.#G#
#######
TST;
$combat = <<<TST
#######   
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#   
#######
TST;
$lines  = explode("\n", $in);

class area {
	public $grid;
	public $goblins = [];
	public $elves = [];
	public $completedTurns = 0;
	public $cells = [];

	public function __construct($grid) {
		$this->grid = [];
		foreach ($grid as $y => $row) {
			$r = [];
			for ($x = 0; $x < strlen($row); $x++) {
				$c             = $grid[$y][$x];
				$cell          = new cell($y, $x, $c, $this);
				$r[]           = $cell;
				$this->cells[] = $cell;

				if ($c === GOBLIN) {
					$this->goblins[] = new goblin($cell);
				} else if ($c === ELF) {
					$this->elves[] = new elf($cell);
				}

			}
			$this->grid[] = $r;
		}
	}

	public function getCell($y, $x) {
		if (isset($this->grid[$y]) && isset($this->grid[$y][$x])) {
			return $this->grid[$y][$x];
		}
		return new cell($y, $x, WALL, $this);
	}

	public function p() {
		$g = [];
		foreach ($this->grid as $y => $row) {
			$r = '';
			foreach ($row as $x => $cell) {
				$r .= $cell->icon;
			}
			$g[] = $r;

		}

		$units = $this->getUnits();
		foreach ($units as $unit) {
			$g[$unit->cell->y] .= $unit;
		}
		$g[] = '';
		$g[] = '';
		echo "After {$this->completedTurns} rounds:\n";
		echo implode("\n", $g);
	}

	public function getUnits() {
		$units = array_merge($this->goblins, $this->elves);
		$units = array_filter($units, function ($u) {
			return $u->alive();
		});
		usort($units, function ($a, $b) {
			return $a->sort($b);
		});
		return $units;
	}

	public function openCells(){
		return array_filter($this->cells, function($c){
			return $c->isOpen();
		});
	}

	public function play($print = FALSE){
		while ($this->turn()){
//			$this->turn();
			if ($print){
				$this->p();
			}
		}
		if ($print){
			$this->p();
		}
		echo "\nGame over! after {$this->completedTurns} the score is {$this->outcome()}\n";
	}

	public function turn() {
		$units = $this->getUnits();

		foreach ($units as $unit) {
			if (!$unit->alive()){
				continue;
			}

			if ($this->isGameOver()){
				return FALSE;
			}

			$start = $unit->cell;

			$targets = array_filter($unit instanceof elf ? $this->goblins : $this->elves, function ($u) {
				return $u->alive();
			});

			// find any enemies in range
			$willTarget = NULL;
			$inRange    = [];
			$canTargets = [];
			foreach ($targets as $target) {
				if ($unit->canAttack($target)) {
					$canTargets[] = $target;
				} else {
					$inRange = array_merge($inRange, $target->cell->neighbours());
				}
			}
			usort($canTargets, function($a, $b){
				return $a->attackSort($b);
			});

			// attack if we can, otherwise move
			if (count($canTargets) > 0) {
				$willTarget = reset($canTargets);
				$unit->attack($willTarget);
			} else {
				// for every in range square, work out which are reachable
				$reachable = [];
				foreach ($inRange as $cell) {
					$paths = $this->astar($start, $cell);
					if ($paths) {
						$reachable = array_merge($reachable, $paths);
					}
				}

				// for every reachable cell, find the closest
				usort($reachable, function ($a, $b) {
					return $a->sort($b);
				});

				if (count($reachable) === 0) {
					// can't do anything, end turn
				} else {
					if (count($reachable) > 1){
//						echo "Moving $unit, many options:\n";
//						echo implode("\n", $reachable);
					}
					// of the closest, find the first in reading order to choose
					$bestPath = reset($reachable);
//					echo "Choosing $bestPath\n";
					$move     = $bestPath->first();
//					echo "Moving to $move\n";
					$unit->moveTo($move);

					$willTarget = NULL;
					$canTargets = [];
					foreach ($targets as $target) {
						if ($unit->canAttack($target)) {
							$canTargets[] = $target;
						}
					}
					usort($canTargets, function($a, $b){
						return $a->attackSort($b);
					});

					if (count($canTargets) > 0) {
						$willTarget = reset($canTargets);
						$unit->attack($willTarget);
					}
				}
			}
		}
		$this->completedTurns++;
		return TRUE;
	}

	public function djk($start, $goal){
//		echo "Running djk from $start to $goal\n";
		$dist = new map();
		$dist->set($start, new path($start));
		$q = new set();
		$q->add($start);

		foreach ($this->openCells() as $cell){
			if ($cell !== $start){
				$dist->set($cell, new fakepath(9999));
			}
			$q->add($cell);
		}

		$goalPaths = [];
		$minToGoal = 9999;

		while ($q->count()){
			$current = $this->minDist($q, $dist, $goal);
			if (!$current){
				break;
			}
			$currentPath = $dist->get($current);
			$q->remove($current);

			if ($currentPath->dist() > $minToGoal){
				continue;
			}

			foreach ($current->neighbours() as $n){
				$nextPath = $currentPath->step($n);
				$d = $nextPath->dist();
				if ($d < $dist->get($n)->dist()){
					$dist->set($n, $nextPath);
				}
				if ($n === $goal){
					if ($d < $minToGoal){
						$goalPaths = [$nextPath];
					} else if ($d === $minToGoal){
						$goalPaths[] = $nextPath;
					}
				}
			}
		}
		return $goalPaths;

	}

	public function minDist($q, $distMap, $goal){
		$min     = 9999;
		$minCell = '';
		foreach ($q->hash as $key => $cell) {
			$path = $distMap->get($cell);
			$score = $path->dist();
			if ($score < $min) {
				$min     = $score;
				$minCell = $cell;
			} else if ($score == $min && $minCell){
				if ($this->costEstimate($cell, $goal) < $this->costEstimate($minCell, $goal)){
					$minCell = $cell;
				}
			}
		}
		return $minCell;
	}

	public function astar($start, $goal) {
//		echo "astar $start to $goal\n";
		$closedSet = new set();
		$openSet   = new set();
		$openSet->add($start);
		$cameFrom = new map();
		$gScore   = new map();
		$gScore->set($start, 0);
		$fScore = new map();
		$fScore->set($start, $this->costEstimate($start, $goal));

		$paths = [];
		while ($openSet->count()) {
			$current = $this->lowestScore($openSet, $fScore);

			$openSet->remove($current);
			$closedSet->add($current);

			if ($current === $goal) {
				$path = $this->reconstructPath($cameFrom, $current);
				$paths[] = $path;
			} else {
				foreach ($current->neighbours() as $neighbour) {
					if ($closedSet->has($neighbour)) {
						continue; // already evaluated
					}

					$tmpGScore = $gScore->get($current) + $current->dist($neighbour);
					if (!$openSet->has($neighbour)) {
						$openSet->add($neighbour);
					} else if ($tmpGScore > $gScore->get($neighbour)) {
						continue;
					}

					$cameFrom->set($neighbour, $current);
					$gScore->set($neighbour, $tmpGScore);
					$fScore->set($neighbour, $tmpGScore + $this->costEstimate($neighbour, $goal));
				}
			}
		}
		return $paths; // cant get a path there
	}

	public function costEstimate($start, $goal) {
		return $goal->dist($start);
	}

	public function lowestScore($openSet, $fScore) {
		$min     = 9999;
		$minCell = '';
		foreach ($openSet->hash as $key => $cell) {
			$score = $fScore->get($cell);
			if ($score < $min) {
				$min     = $score;
				$minCell = $cell;
			}
		}
		return $minCell;
	}

	public function reconstructPath($cameFrom, $current) {
		$path = new path($current);
		while ($cameFrom->has($current)) {
			$current = $cameFrom->get($current);
			$path->before($current);
		}
		return $path;
	}

	public function isGameOver() {
		return $this->gHP() === 0 || $this->eHP() === 0;
	}

	public function gHP() {
		$g = 0;
		foreach ($this->goblins as $goblin) {
			$g += max(0, $goblin->hp);
		}
		return $g;
	}

	public function eHP() {
		$e = 0;
		foreach ($this->elves as $elf) {
			$e += max(0, $elf->hp);
		}
		return $e;
	}

	public function outcome() {
		$remainingHP = $this->gHP() + $this->eHP();
		return $this->completedTurns * $remainingHP;
	}
}

class set {
	public $hash = [];

	public function add($o) {
		$this->hash[$o . ''] = $o;
	}

	public function remove($o) {
		unset($this->hash[$o . '']);
	}

	public function count() {
		return count($this->hash);
	}

	public function has($o) {
		return isset($this->hash[$o . '']);
	}
}

class map {
	public $hash = [];
	public $keys = [];

	public function set($k, $v) {
		$this->hash[$k . ''] = $v;
		$this->keys[$k . ''] = $k;
	}

	public function remove($k) {
		unset($this->hash[$k . '']);
	}

	public function count() {
		return count($this->hash);
	}

	public function get($k) {
		return $this->has($k) ? $this->hash[$k . ''] : NULL;
	}

	public function has($k) {
		return isset($this->hash[$k . '']);
	}
}

class path {
	public $arr = []; // array of cells

	public function __construct($end) {
		if (is_array($end)){
			$this->arr = $end;
		} else {
			$this->arr[] = $end;
		}
	}

	public function before($step) {
		array_unshift($this->arr, $step);
	}

	public function step($step){
		$new = array_merge($this->arr, [$step]);
		return new path($new);
	}

	public function sortValue() {
		$first = $this->first();
		$goal = end($this->arr);

		return $this->dist() * 99999999 + $goal->y * 999999 + $goal->x * 9999 + $first->y * 99 + $first->x;
	}

	public function first() {
		return $this->arr[1]; //0 is the starting position
	}

	public function end(){
		return end($this->arr);
	}

	public function dist() {
		return count($this->arr);
	}

	public function __toString() {
		return implode(" -> ", $this->arr) . ' = ' . $this->dist();
	}

	public function sort($other){
		$md = $this->dist();
		$od = $other->dist();
		if ($md !== $od){
			return $md - $od;
		}

		$me = $this->end();
		$oe = $other->end();
		$endSort = $me->sort($oe);
		if ($endSort == 0){
			$mf = $this->first();
			$of = $other->first();
			$firstSort = $mf->sort($of);
			return $firstSort;
		} else {
			return $endSort;
		}
	}
}

class fakepath extends path {
	public $dist;
	public function __construct($fakedist){
		$this->dist = $fakedist;
	}
	public function dist(){
		return $this->dist;
	}
}

class cell {
	public $x;
	public $y;
	public $isWall = FALSE;
	public $icon;
	public $grid;
	public $unit;

	public function __construct($y, $x, $icon, $grid) {
		$this->y      = $y;
		$this->x      = $x;
		$this->icon   = $icon;
		$this->isWall = $icon === WALL;
		$this->grid   = $grid;
	}

	public function __toString() {
		return "{$this->x},{$this->y}";
	}

	public function dist($y, $x = NULL) {
		if ($y instanceof cell) {
			$x = $y->x;
			$y = $y->y;
		}
		return abs($y - $this->y) + abs($x - $this->x);
	}

	public function sortValue() {
		return $this->y * 999 + $this->x;
	}

	public function placeUnit($unit) {
		$this->unit = $unit;
		$this->icon = $unit->icon;
	}

	public function leaveUnit() {
		$this->unit = NULL;
		$this->icon = OPEN;
	}

	public function isOpen() {
		return $this->icon === OPEN;
	}

	public function neighbours() {
		$n    = [];
		$offs = [[-1, 0], [0, -1], [0, 1], [1, 0]]; // offsets, in reading order (up, left, right, down)
		foreach ($offs as $o) {
			list($dy, $dx) = $o;
			$cell = $this->grid->getCell($this->y + $dy, $this->x + $dx);
			if ($cell->isOpen()) {
				$n[] = $cell;
			}
		}

		return $n;
	}

	public function sort($target){
		if ($this->y === $target->y){
			return $this->x - $target->x;
		}
		return $this->y - $target->y;
	}
}

class unit {
	public $hp = 200;
	public $att = 3;

	public $cell;

	public function __construct($cell) {
		$this->cell = $cell;
		$cell->placeUnit($this);
	}

	public function alive(){
		return $this->hp > 0;
	}

	public function sortValue() {
		return $this->cell->sortValue();
	}

	public function __toString() {
		return " {$this->icon}({$this->hp})";// @ {$this->cell->x},{$this->cell->y}";
	}

	public function moveTo($cell) {
		$this->cell->leaveUnit();
		$this->cell = $cell;
		$cell->placeUnit($this);
	}

	public function canAttack($target) {
		return $this->alive() && $this->cell && $target->alive() && $target->cell && $this->cell->dist($target->cell) === 1;
	}

	public function attack($target) {
		$target->beAttacked($this->att);
//		echo "$this attacks $target\n";
	}

	public function beAttacked($damage){
		$this->hp -= $damage;
		if (!$this->alive()){
//			echo "$this died at {$this->cell}\n";
			$this->cell->leaveUnit();
			$this->cell = null;
		}
	}

	public function sort($target){
		// reading order
		return $this->cell->sort($target->cell);
	}

	public function attackSort($target){
		if ($this->hp === $target->hp){
			return $this->sort($target);
		} else {
			return $this->hp - $target->hp;
		}
	}
}

class goblin extends unit {
	public $icon = GOBLIN;
}

class elf extends unit {
	public $icon = ELF;
}

//$g1 = new area(explode("\n", $test));
//$g1->p();
//$g1->turn();
//$g1->p();
//$g1->turn();
//$g1->p();
//$g1->turn();
//$g1->p();

//$g2 = new area(explode("\n", $test2));
//$g2->p();
//$g2->turn();
//
//$g = new area($lines);

$g = new area(explode("\n", $combat));
//$g->play();
//$g3->p();

$combat2 = <<<TST
#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######
TST;
$g = new area(explode("\n", $combat2));
//$g->p();
//$g->turn();
//$g->p();
//$g->play(FALSE);
//$g->p();

$combat3 = <<<TST
#######   
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######
TST;
$g = new area(explode("\n", $combat3));
//$g->p();
//$g->turn();
//$g->p();
//$g->play(FALSE);

$combat4 = <<<TST
#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######       
TST;
$g = new area(explode("\n", $combat4));
//$g->play(FALSE);

$combat5 = <<<TST
#######   
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######
TST;
$g = new area(explode("\n", $combat5));
//$g->play(FALSE);

$combat6 = <<<TST
#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
######### 
TST;
$g = new area(explode("\n", $combat6));
//$g->play(FALSE);

$g = new area(explode("\n", $in));
// $g->p();
// $g->turn();
// $g->p();
$g->play(TRUE); // TOO LOW 234855 ALSO 238478

// WRONGOOO
//Game over! after 77 the score is 211365
//
//real	19m7.432s
//user	17m57.748s
//sys	0m10.352s


$corner1 = <<<TST
####
##E#
#GG#
####
TST;
$g = new area(explode("\n", $corner1));
//$g->play(FALSE); //13400

$corner2 = <<<TST
#####
#GG##
#.###
#..E#
#.#G#
#.E##
#####
TST;
$g = new area(explode("\n", $corner2));
//$g->play(FALSE); //13987

// reddit wrong answer 187810 after 70
// mine wrong 206312 after 74
// correct answer should be 261855 after 99
$in     = file_get_contents('input15c.txt');
$g = new area(explode("\n", $in));
//$g->play(TRUE);

// reddit correct 214731
// mine 203588 @ 77
$in     = file_get_contents('input15d.txt');
$g = new area(explode("\n", $in));
//$g->play(TRUE);