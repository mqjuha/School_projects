#include "instance.hh"
#include "course.hh"

Instance::Instance(std::string name):
    name_(name),
    date_ ({})
{
    date_.push_back(Date::day_);
    date_.push_back(Date::month_);
    date_.push_back(Date::year_);
}
