#!/usr/bin/env php
<?php $in = file_get_contents('input17.txt');
$spring = [500, 0];
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
// $in = $test;
$lines = explode("\n", $in);

global $minX;
$minX = 9999;
$maxX = 0;
$minY = 9999;
$maxY = 0;
foreach ($lines as $line) {
    $bits = explode(', ', $line);
    list($fixed, $range) = $bits;
    list($fvar, $fval) = explode('=', $fixed);
    list($rvar, $valrange) = explode('=', $range);
    list($from, $to) = explode("..", $valrange);
    // echo "$line -- $fixed $range / $fvar $fval / $rvar $from - $to\n"; exit;
    if ($fvar === 'y') {
        $minY = min($minY, $fval);
        $maxY = max($maxY, $fval);
    } else {
        $minX = min($minX, $fval);
        $maxX = max($maxX, $fval);
    }
    if ($rvar === 'y') {
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
define('DRIP', '|');
global $grid;
$grid = array_pad([], $maxY + 5, str_pad('', $maxX + 5, OPEN));

foreach ($lines as $line) {
    $bits = explode(', ', $line);
    list($fixed, $range) = $bits;
    list($fvar, $fval) = explode('=', $fixed);
    list($rvar, $valrange) = explode('=', $range);
    list($from, $to) = explode("..", $valrange);
    // echo "$line -- $fixed $range / $fvar $fval / $rvar $from - $to\n"; exit;
    if ($fvar === 'y') {
        $y = $fval;
        for ($x = $from; $x <= $to; $x++) {
            $grid[$y][$x] = CLAY;
        }
    } else {
        $x = $fval;
        for ($y = $from; $y <= $to; $y++) {
            $grid[$y][$x] = CLAY;
        }
    }
}

function p($grid, $water = null)
{
    global $minX;
    $w = $grid;
    if ($water) {
        list($wy, $wx) = [$water->y, $water->x];
        $w[$wy][$wx] = WATER;
    }
    foreach ($w as $row) {
        echo substr($row, $minX) . "\n";
    }
    $total = implode('', $grid);
    $t = strlen($total);
    $d = -1; //spring
    for ($c = 0; $c < $t; $c++) {
        $x = $total[$c];
        if ($x === WATER || $x === DRIP) {
            $d++;
        }
    }
    echo $d;
    echo "\n";
}

// p($grid);

class water
{
    public $x;
    public $y;
    public $grid;
    public $leftWall = false;
    public $rightWall = false;
    public $reverse = false;
    public $lastFall;
    public $falling = false;
    public function __construct($spring)
    {
        list($this->x, $this->y) = $spring;

        global $grid;
        $this->grid = $grid;
    }
    public function down()
    {
        $this->y++;
        $this->leftWall = false;
        $this->rightWall = false;
    }
    public function left()
    {
        $this->x--;
    }
    public function right()
    {
        $this->x++;
    }
    public function up()
    {
        $this->y--;
        $this->leftWall = false;
        $this->rightWall = false;
    }

    public function move()
    {
        global $grid;
        $this->grid = $grid;
        echo "Water at {$this->x},{$this->y}\n";

        $down = [1, 0];
        if ($this->canMove($down)) {
            if (!$this->falling) {
                $this->lastFall = [$this->x, $this->y];
                $this->falling = true;
            }
            $this->y++;
            $this->leftWall = $this->rightWall = false;
            return true;
        }
        $this->falling = false;
        if ($this->reverse) {
            $left = [0, -1];
            if (!$this->leftWall && $this->canMove($left)) {
                $this->x--;
                return true;
            } else {
                $this->leftWall = true;
            }
            $right = [0, 1];
            if ($this->canMove($right)) {
                $this->x++;
                return true;
            } else {
                $this->rightWall = true;
                $grid[$this->y][$this->x] = WATER;
            }
        } else {
            $right = [0, 1];
            if (!$this->rightWall && $this->canMove($right)) {
                $this->x++;
                return true;
            } else {
                $this->rightWall = true;
            }
            $left = [0, -1];
            if ($this->canMove($left)) {
                $this->x--;
                return true;
            } else {
                $this->leftWall = true;
                $grid[$this->y][$this->x] = WATER;
            }
        }
    }

    public function canMove($dir)
    {
        list($dy, $dx) = $dir;
        $y = $this->y + $dy;
        $x = $this->x + $dx;
        if (
            isset($this->grid[$y]) &&
            isset($this->grid[$y][$x]) &&
            ($this->grid[$y][$x] === OPEN || $this->grid[$y][$x] === DRIP)
        ) {
            return true;
        }
        return false;
    }
}

class waterpath extends water
{
    public $count = 0;
    public $lastDecision;
    public $maxY;

    public function __construct($spring, $maxY, $reverse = false)
    {
        parent::__construct($spring);
        $this->maxY = $maxY;
        $this->reverse = $reverse;
    }

    public function run()
    {
        global $grid;
        while ($this->y < $this->maxY) {
            $this->move();
            $this->count++;
            $grid[$this->y][$this->x] = DRIP;
        }
    }
}

$fellThrough = false;
$done = 0;
$start = $spring;
p($grid);
while (!$fellThrough) {
    $w = new water($start);
    while ($w->move()) {
    }
    $done++;
    // p($grid);
    if ($w->y > $maxY) {
        $fellThrough = true;
    } elseif ($w->lastFall) {
        $start = $w->lastFall;
    }
}
$p = new waterpath($spring, $maxY);
$p->run();
$p = new waterpath($spring, $maxY, true);
$p->run();

$total = implode('', $grid);
$t = strlen($total);
$d = -1; //spring
for ($c = 0; $c < $t; $c++) {
    $x = $total[$c];
    if ($x === WATER || $x === DRIP) {
        $d++;
    }
}
echo $d;
echo "\n";
