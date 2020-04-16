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


void Account::print() const
{
    std::cout << account_number_ << ": "
              << first_name_ << " "
              << last_name_  << ", "
              << email_ << std::endl;
}

std::string Account::get_email()
{
    return email_;
}

void Account::add_instance(Instance *new_instance)
{
    current_.push_back(new_instance);
}

void Account::instance_completed(Instance *inst, Course *cours)
{
    std::string::size_type index = 0;

    // tarkistaa onko tyyppi kurssilla
    for ( Instance* instance : current_ ){

        if ( instance == inst ){
            current_.erase(index);
            completed_.push_back(cours);
            credits_ += 5;
            std::cout << "Course completed" << std::endl;

            return;
        }
        ++ index;
    }
    std::cout << "No signups found on this instance." << std::endl;
}

void Account::print_completed()
{
    for ( Course* completed : completed_ ){
        completed->print_info(true);
    }
    std::cout << "Total credits: " << credits_ << std::endl;
}

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


