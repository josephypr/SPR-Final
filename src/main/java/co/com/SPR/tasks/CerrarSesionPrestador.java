package co.com.SPR.tasks;

import co.com.SPR.userinterface.HomePrestador;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import static co.com.SPR.userinterface.Campos.*;

public class CerrarSesionPrestador implements Task  {
    HomePrestador homePrestador;
    public static CerrarSesionPrestador cerrarpagina() {return Tasks.instrumented(CerrarSesionPrestador.class);
    }
    @Override
    public <T extends Actor> void performAs(T actor){actor.attemptsTo(
            Click.on(BTN_USUARIO),
            Click.on(BTN_CERRAR_SESION)
    );}
}
