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

  // Get last nine movies
  public function recent() {
    // Create query
    $query = "SELECT * FROM $this->table ORDER BY id DESC LIMIT 7";
    // Prepare statement
    $stmt = $this->conn->prepare($query);
    // Execute query
    $stmt->execute();
    return $stmt;
  }

  // Get movie based on id
  public function getOne() {
    // Create query
    $query = "SELECT * FROM $this->table WHERE id=? LIMIT 0,1";
    // Prepare statemnt
    $stmt = $this->conn->prepare($query);
    // Bind params
    $stmt->bindParam(1, $this->id);
    // Execute query
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    // Set props
    $this->tmdb_id = $row['tmdb_id'];
    $this->title = $row['title'];
    $this->tagline = $row['tagline'];
    $this->release_date = $row['release_date'];
    $this->runtime = $row['runtime'];
    $this->genres = $row['genres'];
    $this->overview = $row['overview'];
    $this->poster = $row['poster'];
    $this->backdrop = $row['backdrop'];
    $this->trailers = $row['trailers'];
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
    $query = "SELECT * FROM movies ".$condition." ORDER BY RAND() LIMIT 12";
    // Prepare statemnt
    $stmt = $this->conn->prepare($query);
    // Execute query
    $stmt->execute();
    return $stmt;
  }

}