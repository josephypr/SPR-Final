package co.com.SPR.tasks;
import net.serenitybdd.screenplay.Actor;
import co.com.SPR.userinterface.RegistroSPR;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Open;

public class abrirSPR implements Task {

    RegistroSPR registroSPR;

    public static abrirSPR lapagina() { return Tasks.instrumented(abrirSPR.class);}

    @Override
    public <T extends Actor> void performAs(T actor){
        actor.attemptsTo(Open.browserOn(registroSPR));
    }
}
