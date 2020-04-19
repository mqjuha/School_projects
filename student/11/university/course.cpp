/* University
 *
 * Class: Course
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * Notes: Code already exists and I haven't changed it,
 * only added comments
 *
 * */

#include "course.hh"

Course::Course(std::string code, std::string name, int credits):
    course_code_(code), name_(name), credits_(credits)
{

}

Course::~Course()
{
    for ( Instance* inst : instances_ ){
        delete inst;
    }
}

// Function prints course's code and name
// Parameters:
// print_new_line = information whether the line ends
void Course::print_info(bool print_new_line)
{
    std::cout << course_code_ << " : " << name_;
    if(print_new_line) {
        std::cout << std::endl;
    }
}

// Function prints course staffs information
void Course::print_staff()
{
    std::cout << "* Staff: " << std::endl;
    for (auto acc : course_staff_ ){
        acc->print();
    }
}

// Function prints course's name, code and instances
void Course::print_long_info()
{
    std::cout << "* Course name: " << name_ << std::endl
              << "* Code: " << course_code_ << std::endl;
    print_staff();
    std::cout << "* Instances: " << std::endl;

    for ( auto instance : instances_ ){
        instance->print();
    }
}

// Function prints instance and signups
void Course::print_signups()
{
    for ( auto inst : instances_ ){
        inst->print();
        inst->print_students();
    }
}

// Function adds staff to course if staff isn't already in it
// Parameters:
// new staff = new staff
void Course::add_staff(Account *new_staff)
{
    for(unsigned int i = 0; i < course_staff_.size(); ++i)
    {
        if(course_staff_.at(i) == new_staff)
        {
            std::cout << STAFF_EXISTS << std::endl;
            return;
        }
    }
    course_staff_.push_back(new_staff);
    std::cout << STAFF_ADDED << std::endl;
}

// Function adds instance
// Parameters:
// n_instance = new instance
void Course::new_instance(Instance *n_instance)
{
    instances_.push_back(n_instance);
    std::cout << INSTANCE_ADDED << std::endl;
}

// Function checks if instance already exists
// Parameters:
// name = instance
// Return:
// true = instance already exists
// false = intance doesn't already exist
bool Course::has_instance(const std::string &name)
{
    for ( auto inst : instances_ ){
        if ( inst->is_named(name) ){
            return true;
        }
    }
    return false;
}

Instance *Course::get_instance(std::string name)
{
    for ( Instance* inst : instances_ ){
        if ( inst->is_named(name) ){
            return inst;
        }
    }
    return nullptr;
}

// Function gets courses code
// Returns:
// course_code = courses code
const std::string Course::get_code() const
{
    return course_code_;
}

// Function gets students credits
// Returns:
// credits = students credits
int Course::get_credits() const
{
    return credits_;
}

// Function gets courses name
// Returns:
// name = courses name
const std::string Course::get_name() const
{
    return name_;
}


