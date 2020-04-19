/* University
 *
 * Class: Account
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * */

#include "account.hh"
#include "utils.hh"
#include "instance.hh"
#include "course.hh"

Account::Account(std::string full_name, std::string email, int account_number):
    full_name_(full_name),
    last_name_(""),
    first_name_(""),
    email_(email),
    account_number_(account_number),
    credits_(0)
{
    std::vector<std::string> name = utils::split(full_name_, ' ');
    last_name_ = name.back();
    first_name_ = name.front();
}

// Function prints account's number, name and email
void Account::print() const
{
    std::cout << account_number_ << ": "
              << first_name_ << " "
              << last_name_  << ", "
              << email_ << std::endl;
}

// Function gets persons email
// Return:
// email = persons email
std::string Account::get_email()
{
    return email_;
}

// Function adds instance to current courses
// Parameters:
// new_instance = instance that wanted add
void Account::add_instance(Instance *new_instance)
{
    current_.push_back(new_instance);
}

// Function deletes instance from current,
// adds course to copmleted and 5 credits points
// Parameters:
// inst = current instance
// cours = intance's course
// Return:
void Account::instance_completed(Instance *inst, Course *cours)
{
    // Calculater for instance's index
    std::string::size_type index = 0;
    for ( Instance* instance : current_ ){
        if ( instance == inst ){
            current_.erase(current_.begin()+index);
            completed_.push_back(cours);
            credits_ += CREDIT;
            std::cout << COMPLETED << std::endl;
            return;
        }
        ++ index;
    }
    std::cout << NO_SIGNUPS << std::endl;
}

// Function prints completed courses' and credits
void Account::print_completed()
{
    for ( Course* completed : completed_ ){
        completed->print_info(true);
    }
    std::cout << "Total credits: " << credits_ << std::endl;
}

// Function prints currents, completed and credits
void Account::print_study_state()
{
    std::cout << "Current:" << std::endl;
    for ( Instance* current : current_ ){
        current->print_info();
    }
    std::cout << "Completed:" << std::endl;
    for ( Course* completed : completed_ ){
        completed->print_info(true);
    }
    std::cout << "Total credits: " << credits_ << std::endl;
}


