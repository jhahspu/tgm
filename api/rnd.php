<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// database connection
include_once 'database.php';
// mvs modules
include_once 'mvs.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Instantiate Mvs obj
$mvs = new Mvs($db);

// Check if genre is set and get random movies
isset($_GET['genre']) ? $temp = $_GET['genre'] : $temp = "";
$result = $mvs->getRnd($temp);

// Get row count
$num = $result->rowCount();

// Check if any rows
if($num > 0) {
  // Initialize array for end results
  $mvs_arr = array();

  // Extract rows
  while($row = $result->fetch(PDO::FETCH_ASSOC)) {
    extract($row);
    $mvs_item = array(
      'id' => $id,
      'tmdb' => $tmdb_id,
      'title' => $title,
      'release_date' => $release_date,
      'runtime' => $runtime,
      'genres' => $genres,
      'overview' => $overview,
      'poster' => $poster,
      'trailers' => $trailers
    );
    // Dump data into reults array
    array_push($mvs_arr, $mvs_item);
  }

  // Encode results into JSON
  echo json_encode($mvs_arr);
  
} else {
  // No Movies
  echo json_encode(
    array('message' => 'No Movies Found')
  );
}