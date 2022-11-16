/* University
 *
 * Desc:
 *  This program saves universitys and students data.
 *  Also searches univerity's, student's and course's information.
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * */


#include "utils.hh"
#include "cli.hh"
#include "university.hh"
#include <iostream>
#include <string>
#include <vector>
#include <fstream>

const std::string PROMPT = "Uni> ";


int main()
{
    University* university = new University();
    Cli cli(university, PROMPT);
    while ( cli.exec() ){}

    delete university;
    return EXIT_SUCCESS;
}
