#include "instance.hh"
#include "course.hh"

Instance::Instance(std::string name, Date date):
    name_(name),
    date_(date),
    staff_({})
{

}

bool Instance::is_possible_add_staff(Account *new_staff)
{
    for ( Account* staff : staff_ ){
        if ( staff == new_staff ) {
            std::cout << "Error: Student has already registered on this course."
                      << std::endl;
            return false;
        }    
    }
    // ei voi ilmottautua aloituspäivämäärän jälkeen
    if ( Date::operator <(date_) ){
        staff_.push_back(new_staff);
        std::cout << "Signed up on the course instance." << std::endl;

        return true;
        
    } else {
        std::cout << "Error: Can't sign up on instance after the starting date."
                  << std::endl;
        return false;
    }
}
