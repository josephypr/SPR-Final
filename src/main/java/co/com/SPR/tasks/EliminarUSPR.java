package co.com.SPR.tasks;
import co.com.SPR.userinterface.EliminarSPR;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.SPR.userinterface.Campos.BTN_ELIMINAR;

public class EliminarUSPR implements Task {

    EliminarSPR eliminarspr;

    public static Question<Boolean> lapaginaeliminar() { return (Question<Boolean>) Tasks.instrumented(EliminarUSPR.class);}

    @Override

    public <T extends Actor> void performAs(T actor){
        actor.attemptsTo(Click.on(BTN_ELIMINAR));}
}

