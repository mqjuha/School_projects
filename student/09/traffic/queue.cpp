#include "queue.hh"
#include <iostream>
#include <string>

// Implement the member functions of Queue here

Queue::Queue(unsigned int cycle): first_(), last_(), is_green_(), cycle_(cycle)
{

}

Queue::~Queue()
{
    Vehicle* tmp = first_;
    while (tmp != nullptr){
        first_ = first_->next;
        delete tmp;
        tmp = first_;
    }
}

void Queue::enqueue(string reg)
{
    if(is_green_){
        std::cout << "GREEN: The vehicle " << reg <<
                     " need not stop to wait" << std::endl;
        return;
    }
    if ( first_ == nullptr ) {
        first_ = new Vehicle{reg, last_};
        return;
    }
    else if(first_->next == nullptr){
        Vehicle* new_item = new Vehicle{reg, last_};
        first_->next = new_item;

    }else{
        Vehicle* new_item = new Vehicle{reg, last_};
        Vehicle* last = first_;
        while(last->next->next != nullptr){
            last = last->next;
        }
        last->next->next = new_item;
    }
}

void Queue::switch_light()
{
    if(not is_green_){
        if(first_ == nullptr){
            is_green_ = true;
            std::cout << "GREEN: No vehicles waiting in traffic lights"
                      << std::endl;
            return;
        }else{
            std::cout << "GREEN: Vehicle(s) ";
            unsigned int counter = 0;
            while(counter != cycle_){
                if(first_ == nullptr){
                    std::cout << "can go on" << std::endl;
                    return;
                }
                std::cout << first_->reg_num << " ";
                Vehicle* new_first = first_->next;
                delete first_;
                first_ = new_first;
                ++ counter;
            }
            std::cout << "can go on" << std::endl;
        }
    }else{
        is_green_ = false;
        std::cout << "RED: No vehicles waiting in traffic lights"
                  << std::endl;
    }
}

void Queue::reset_cycle(unsigned int cycle)
{
    cycle_ = cycle;
}

void Queue::print()
{
    if(not is_green_){
        if(first_ == nullptr){
            std::cout << "RED: No vehicles waiting in traffic lights"
                      << std::endl;
            return;
        }
        std::cout << "RED: Vehicle(s) ";

        Vehicle* item_to_be_printed = first_;

        while ( item_to_be_printed != nullptr ) {
           std::cout << item_to_be_printed->reg_num << " " ;
           item_to_be_printed = item_to_be_printed->next;
        }
        std::cout<< "waiting in traffic lights" << std::endl;
        }
}
