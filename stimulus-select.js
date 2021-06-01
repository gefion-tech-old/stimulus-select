/*
	Событие stimulus-select-end
    
    {
    	detail: {
        	selected: Array,
            actualItems: Array,
            notActualItems: Array
        }
    }
*/
class SelectController extends Stimulus.Controller {  
  	static classes = ['on', 'off']
    
    static targets = ['input', 'item']
  
  	static values = {
		selected: Array,
        multiple: Boolean
  	}
    
    selectedValueChanged() {
    	let actualItems = this.itemTargets.filter(item => {
        	return this.selectedValue.includes(item.dataset.selectItem)
        })
        
        let notActualItems = this.itemTargets.filter(item => {
        	return !this.selectedValue.includes(item.dataset.selectItem)
        })
        
        this.itemClassManagement(actualItems, true)
        this.itemClassManagement(notActualItems, false)
        
        if (this.hasInputTarget) {
        	this.inputTarget.value = JSON.stringify(
            	actualItems.map(item => item.dataset.selectItem)
            )
        }
        
        this.element.dispatchEvent(new CustomEvent('stimulus-select-end', {
        	detail: {
            	selected: this.selectedValue,
                actualItems: actualItems,
                notActualItems: notActualItems
            }
        }))
    }
    
    select({ currentTarget }) {
    	let selectItem = currentTarget.dataset.selectItem
        
    	if (selectItem) {
        	if (this.multipleValue) {
            	if (!this.selectedValue.includes(selectItem)) {
                    this.selectedValue = [...this.selectedValue, selectItem]
                } else {
                	this.selectedValue = this.selectedValue.filter(value => {
                    	return value !== selectItem
                    })
                }
            } else {
                if (!this.selectedValue.includes(selectItem)) {
                	this.selectedValue = [currentTarget.dataset.selectItem]
                } else {
                	this.selectedValue = []
                }
            }
        }
    }
    
    clear() {
    	this.selectedValue = []
    }
    
    itemClassManagement(items, status) {
    	let onClasses = this.hasOnClass ? this.onClass.split(' ') : []
        let offClasses = this.hasOffClass ? this.offClass.split(' ') : []
        
        items.forEach(item => {
        	if (status) {
            	offClasses.forEach(className => {
                    item.classList.remove(className)
                })
				
                if (onClasses.length > 0) {
                	item.classList.add(...onClasses)
                }
            } else {
            	onClasses.forEach(className => {
                	item.classList.remove(className)
                })
                
                if (offClasses.length > 0) {
                	item.classList.add(...offClasses)
                }
                
            }
        })
    }
}

(function() {
    let application;

    if (window.stimulusApplication) {
        application = window.stimulusApplication
    } else {
        application = Stimulus.Application.start()
    }

    application.register('select', SelectController)

    window.stimulusApplication = application
})()
