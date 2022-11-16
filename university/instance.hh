/* University
 *
 * Class: Instance
 * ----------
 * TIE-02201/TIE-02207 SPRING 2020
 * ----------
 * Class that represent a single instance.
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * Note: I have almost fully done this
 *
 * */

#ifndef INSTANCE_HH
#define INSTANCE_HH

#include "account.hh"
#include "date.hh"
#include "utils.hh"
#include <vector>
#include <iostream>
#include <string>
#include <algorithm>

// Forward-declaration of Course, so that instance can point to the course it belongs to.
class Course;

const std::string ALREADY_REGISTERED = "Error: Student has already registered on this course.";
const std::string LATE = "Error: Can't sign up on instance after the starting date.";
const std::string INDENT = "    ";

class Instance
{
public:
    Instance(std::string name, Date* date, Course* course);
    bool is_possible_add_staff(Account* new_staff, Date* today);
    void print();
    void print_students();
    bool is_named(const std::string &name);
    void print_info();

private:
    Course* course_;
    std::string name_;
    Date* date_;
    std::vector<Account*> staff_;   
};

#endif // INSTANCE_HH
