package co.com.SPR.stepsdefinitions;

import co.com.SPR.tasks.EliminarPostulacion;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class EliminarPostulacionStepDefinitions {
    @Cuando("^el usuario se encuentre postulado en un servicio y quiera eliminarlo podra hacerlo oprimiendo el boton de eliminar$")
    public void elUsuarioSeEncuentrePostuladoEnUnServicioYQuieraEliminarloPodraHacerloOprimiendoElBotonDeEliminar() {
        theActorInTheSpotlight().attemptsTo(EliminarPostulacion.eliminarPostulacion());
    }


    @Entonces("^ya no tendra ese servicio en el que se habia postulado$")
    public void yaNoTendraEseServicioEnElQueSeHabiaPostulado() {

    }
}
