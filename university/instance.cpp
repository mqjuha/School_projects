/* University
 *
 * Class: Instance
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * */

#include "instance.hh"
#include "course.hh"

Instance::Instance(std::string name, Date* date, Course* course):
    course_(course),
    name_(name),
    date_(date),
    staff_()

{
    staff_ = {};
}

// Function checks if it's possible to add student
// Parameters:
// new_staff = student
// today = this days date
// Return:
// false = it isn't possible add
// true = student is added
bool Instance::is_possible_add_staff(Account *new_staff, Date *today)
{
    for ( Account* staff : staff_ ){
        if ( staff == new_staff ) {
            std::cout << ALREADY_REGISTERED << std::endl;
            return false;
        }    
    }
    // checks if starting day has already passed
    if ( today->operator <(*date_) || today->operator == (*date_) ){
        staff_.push_back(new_staff);
        std::cout << "Signed up on the course instance." << std::endl;
        return true;
        
    } else {
        std::cout << LATE << std::endl;
        return false;
    }
}

// Function instance's name, starting date and amount of student
void Instance::print()
{
    std::cout << name_ << std::endl;
    std::cout << INDENT << "Starting date: ";
    date_->print();
    std::cout << std::endl;

    std::cout << INDENT << "Amount of students: " << staff_.size()
              << std::endl;
}

// Function prints signups students
void Instance::print_students()
{
    for ( Account* account : staff_ ){
        std::cout << "  ";
        account->print();
    }
}

// Function checks is name already
// Parameters:
// name = instance
// Return:
// true = name is already
// false = name isn't yet
bool Instance::is_named(const std::string &name)
{
    if ( name_ == name){
        return true;
    }
    return false;
}

// Function prints course's code, name and instance
void Instance::print_info()
{
    std::cout << course_->get_code() << " : " << course_->get_name()
              << " " << name_ << std::endl;
}


