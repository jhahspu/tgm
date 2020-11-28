<?php

class Mvs {
  // DB
  private $conn;
  private $table = 'movies';

  // Mvs props
  public $id;
  public $tmdb_id;
  public $title;
  public $tagline;
  public $release_date;
  public $runtime;
  public $genres;
  public $overview;
  public $poster;
  public $backdrop;
  public $trailers;

  // Constructor with DB
  public function __construct($db) {
    $this->conn = $db;
  }

  // Get random by genres
  public function getRnd($gen) {
    // check if genre was provided
    if(empty($gen) || $gen == 'any') {
      $condition = "";
    } else {
      $condition = " WHERE genres like '%" . $gen . "%'";
    }
    // Create query
    $query = "SELECT * FROM movies ".$condition." ORDER BY RAND() LIMIT 24";
    // Prepare statemnt
    $stmt = $this->conn->prepare($query);
    // Execute query
    $stmt->execute();
    return $stmt;
  }

}