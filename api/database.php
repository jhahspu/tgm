<?php

  // DB credentials
  // LIVE
  require_once("../../acc/acc.php");


  class Database {
    private $dbcred;
    private $hostname;
    private $dbname;
    private $charset;
    private $username;
    private $password;
    private $dsn;
    private $conn;

    public function connect() {
      // local or live
      $this->dbcred = dbDet("local");
      $this->hostname = $this->dbcred[0];
      $this->dbname = $this->dbcred[1];
      $this->charset = $this->dbcred[2];
      $this->username = $this->dbcred[3];
      $this->password = $this->dbcred[4];
      $this->dsn = "mysql:host=".$this->hostname.";dbname=".$this->dbname.";charset=".$this->charset;
      $this->conn = null;

      try {
        $this->conn = new PDO($this->dsn, $this->username, $this->password);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      } catch (PDOException $e) {
        echo 'Connection Error: ' . $e->getMessage();
      }

      return $this->conn;
    }

  }