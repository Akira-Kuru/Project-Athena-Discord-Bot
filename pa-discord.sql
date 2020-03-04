-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pa_discord_bot
-- ------------------------------------------------------
-- Server version	5.7.28-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `pa_events`
--

DROP TABLE IF EXISTS `pa_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pa_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `creator_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pa_events`
--

LOCK TABLES `pa_events` WRITE;
/*!40000 ALTER TABLE `pa_events` DISABLE KEYS */;
INSERT INTO `pa_events` VALUES (1,'UX Meeting','Tuesday','11am PST','hifi://thepalace','181541361353228288'),(2,'Developer Meeting','Saturday','11am PST','hifi://thepalace','181541361353228288'),(3,'Community Meeting','Saturday','12pm PST','hifi://thepalace','181541361353228288'),(5,'Kalila meeting','sunday','2am PST','hifi://codex','181541361353228288');
/*!40000 ALTER TABLE `pa_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pa_events_subs`
--

DROP TABLE IF EXISTS `pa_events_subs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pa_events_subs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `events_id` int(10) unsigned NOT NULL,
  `subs_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pa_events_subs`
--

LOCK TABLES `pa_events_subs` WRITE;
/*!40000 ALTER TABLE `pa_events_subs` DISABLE KEYS */;
INSERT INTO `pa_events_subs` VALUES (2,3,5),(3,5,6),(4,5,7);
/*!40000 ALTER TABLE `pa_events_subs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pa_subs`
--

DROP TABLE IF EXISTS `pa_subs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pa_subs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pa_subs`
--

LOCK TABLES `pa_subs` WRITE;
/*!40000 ALTER TABLE `pa_subs` DISABLE KEYS */;
INSERT INTO `pa_subs` VALUES (5,'181541361353228288'),(6,'181541361353228288'),(7,'181541361353228288');
/*!40000 ALTER TABLE `pa_subs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-27 22:59:27
